import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { basename, dirname, join } from 'path'
import { spawn } from 'child_process'

let registered = false
const sessionState = (globalThis.__karaokeYoutubePlayerSessionState ||= {
  mediaCache: new Map(),
  toolsReadyByPath: new Map()
})
const SEARCH_CACHE_TTL_MS = 10 * 60 * 1000
const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 20
const MAX_FETCH_RESULTS = 120
const MAX_CACHED_MEDIA = 10
const mediaCache = sessionState.mediaCache
const toolsReadyByPath =
  sessionState.toolsReadyByPath || (sessionState.toolsReadyByPath = new Map())

function ensureDir(dirPath) {
  mkdirSync(dirPath, { recursive: true })
}

function getCleanEnv() {
  const env = { ...process.env }
  // Keep yt-dlp isolated from any preload hooks that may be present in the app process.
  delete env.LD_PRELOAD
  return env
}

function getTools(paths) {
  const ytdlpFileName = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp'
  const installedPluginsRoot = dirname(paths.installedRoot)
  const vendorYtdlp = join(installedPluginsRoot, 'ytdlp', 'vendor', 'bin', ytdlpFileName)

  return {
    ytdlp: vendorYtdlp
  }
}

async function canRunCommand(command, args) {
  try {
    await runProcess(command, args, { timeoutMs: 5000 })
    return true
  } catch {
    return false
  }
}

async function assertToolsReady(paths) {
  const tools = getTools(paths)
  const cached = toolsReadyByPath.get(tools.ytdlp)
  if (cached?.ok) {
    return { ok: true, tools }
  }

  if (!(await canRunCommand(tools.ytdlp, ['--version']))) {
    toolsReadyByPath.delete(tools.ytdlp)
    return { ok: false, error: 'YouTube Player requires the yt-dlp plugin. Install yt-dlp first.' }
  }
  toolsReadyByPath.set(tools.ytdlp, { ok: true, checkedAt: Date.now() })
  return { ok: true, tools }
}

function runProcess(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      windowsHide: true,
      env: getCleanEnv(),
      ...options
    })

    let stdout = ''
    let stderr = ''
    let settled = false
    const timeoutMs = Number(options.timeoutMs || 0)
    const timeout = timeoutMs
      ? setTimeout(() => {
          if (settled) return
          child.kill('SIGKILL')
          settled = true
          reject(new Error(`${basename(command)} timed out.`))
        }, timeoutMs)
      : null

    const settle = (callback, value) => {
      if (settled) return
      settled = true
      if (timeout) clearTimeout(timeout)
      callback(value)
    }

    child.stdout.on('data', (chunk) => {
      const text = chunk.toString()
      stdout += text
      options.onStdout?.(text)
    })
    child.stderr.on('data', (chunk) => {
      const text = chunk.toString()
      stderr += text
      options.onStderr?.(text)
    })
    child.on('error', (error) => settle(reject, error))
    child.on('close', (code) => {
      if (code === 0) {
        settle(resolve, { stdout, stderr })
        return
      }
      settle(reject, new Error(stderr.trim() || `${basename(command)} exited with code ${code}`))
    })
  })
}

function parseVideoJsonLines(stdout) {
  return stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line)
      } catch {
        return null
      }
    })
    .filter(Boolean)
    .map((item) => ({
      id: item.id,
      title: item.title || item.fulltitle || item.id,
      artist: item.uploader || item.channel || '',
      thumbnail: item.thumbnail || item.thumbnails?.at?.(-1)?.url || '',
      webpageUrl:
        item.webpage_url ||
        item.url ||
        (item.id ? `https://www.youtube.com/watch?v=${item.id}` : ''),
      duration: item.duration || null
    }))
    .filter((item) => item.id && item.webpageUrl)
}

function getSearchCachePath(paths, query) {
  const key = Buffer.from(
    String(query || '')
      .toLowerCase()
      .trim()
  ).toString('base64url')
  return join(paths.cacheDir, `search-${key}.json`)
}

function readSearchCache(paths, query) {
  const cachePath = getSearchCachePath(paths, query)
  if (!existsSync(cachePath)) {
    return null
  }

  try {
    const cache = JSON.parse(readFileSync(cachePath, 'utf8'))
    if (Date.now() - Number(cache.createdAt || 0) > SEARCH_CACHE_TTL_MS) {
      return null
    }
    return Array.isArray(cache.videos) ? cache.videos : null
  } catch {
    return null
  }
}

function writeSearchCache(paths, query, videos) {
  ensureDir(paths.cacheDir)
  writeFileSync(
    getSearchCachePath(paths, query),
    JSON.stringify(
      {
        createdAt: Date.now(),
        videos
      },
      null,
      2
    )
  )
}

async function listVideos(paths, query, config, options = {}) {
  const ready = await assertToolsReady(paths)
  if (!ready.ok) return ready

  const page = Math.max(1, Number(options.page || 1))
  const pageSize = Math.max(
    1,
    Math.min(MAX_PAGE_SIZE, Number(options.pageSize || DEFAULT_PAGE_SIZE))
  )
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const neededCount = endIndex + 1

  const searchQuery = String(query || '').trim() || String(config.recommendationQuery || '').trim()
  if (!searchQuery) {
    return {
      ok: true,
      videos: [],
      page,
      pageSize,
      totalPages: 1,
      hasPrev: false,
      hasNext: false
    }
  }

  let cached = false
  let allVideos = readSearchCache(paths, searchQuery)
  if (Array.isArray(allVideos) && allVideos.length >= neededCount) {
    cached = true
  } else {
    const fetchCount = Math.min(MAX_FETCH_RESULTS, Math.max(neededCount, DEFAULT_PAGE_SIZE * 3))
    const result = await runProcess(ready.tools.ytdlp, [
      '--dump-json',
      '--flat-playlist',
      '--no-warnings',
      '--playlist-end',
      String(fetchCount),
      `ytsearch${fetchCount}:${searchQuery}`
    ])

    allVideos = parseVideoJsonLines(result.stdout)
    writeSearchCache(paths, searchQuery, allVideos)
  }

  const videos = (allVideos || []).slice(startIndex, endIndex)
  const hasNext = (allVideos || []).length > endIndex
  const totalPages = hasNext ? null : Math.max(1, Math.ceil((allVideos || []).length / pageSize))

  return {
    ok: true,
    videos,
    page,
    pageSize,
    totalPages,
    hasPrev: page > 1,
    hasNext,
    cached
  }
}

async function warmRecommendationCache(paths, getConfig) {
  try {
    const config = getConfig()
    const query = String(config.recommendationQuery || '').trim()
    if (!query || readSearchCache(paths, query)) {
      return
    }
    await listVideos(paths, query, config)
  } catch {
    // Cache warming is best-effort only.
  }
}

function emitJobProgress(sender, pluginId, payload) {
  if (!sender || sender.isDestroyed?.()) return
  sender.send(`plugin:${pluginId}:jobProgress`, payload)
}

function buildMediaItem(pluginId, videoId, title, artist, source) {
  return {
    title,
    artist,
    path: source.webpageUrl || source.videoUrl || '',
    mediaSource: source,
    sourcePluginId: pluginId,
    externalId: videoId
  }
}

function getCachedMediaItem({ plugin, videoId, title, artist }) {
  const cached = mediaCache.get(videoId)
  if (!cached?.source?.webpageUrl) {
    mediaCache.delete(videoId)
    return null
  }

  const nextCached = {
    ...cached,
    title: title || cached.title,
    artist: artist || cached.artist
  }
  mediaCache.set(videoId, nextCached)
  return buildMediaItem(plugin.id, videoId, nextCached.title, nextCached.artist, nextCached.source)
}

function getYtdlFormat(maxVideoHeight) {
  const height = Number(maxVideoHeight || 1080) === 720 ? 720 : 1080
  return `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`
}

function addCachedMedia({ plugin, videoId, title, artist, source }) {
  mediaCache.delete(videoId)
  mediaCache.set(videoId, {
    videoId,
    title,
    artist,
    source,
    preparedAt: Date.now()
  })

  while (mediaCache.size > MAX_CACHED_MEDIA) {
    const oldest = mediaCache.keys().next().value
    if (!oldest) break
    mediaCache.delete(oldest)
  }

  return buildMediaItem(plugin.id, videoId, title, artist, source)
}

async function resolveDashStream({ paths, plugin, sender, video, config }) {
  const videoId = String(video?.id || '').trim()
  const title = String(video?.title || videoId || 'YouTube Video')
  const artist = String(video?.artist || '')
  const url = String(video?.webpageUrl || video?.url || '').trim()

  if (!videoId || !url) {
    return { ok: false, error: 'Invalid YouTube video.' }
  }

  ensureDir(paths.cacheDir)

  const maxVideoHeight = Number(config.maxVideoHeight || 1080) === 720 ? 720 : 1080
  const cachedMediaItem = getCachedMediaItem({ plugin, videoId, title, artist })
  if (cachedMediaItem) {
    return {
      ok: true,
      cached: true,
      mediaItem: cachedMediaItem
    }
  }

  const ready = await assertToolsReady(paths)
  if (!ready.ok) return ready

  try {
    emitJobProgress(sender, plugin.id, {
      videoId,
      status: 'downloading',
      label: `Preparing DASH stream for ${title}`,
      percent: 10
    })

    const source = {
      backend: 'libmpv-ytdl',
      webpageUrl: url,
      title,
      maxHeight: maxVideoHeight,
      ytdlFormat: getYtdlFormat(maxVideoHeight),
      ytdlPath: ready.tools.ytdlp
    }

    emitJobProgress(sender, plugin.id, {
      videoId,
      status: 'done',
      label: `Ready to stream ${title}`,
      percent: 100
    })

    return {
      ok: true,
      mediaItem: addCachedMedia({ plugin, videoId, title, artist, source })
    }
  } catch (error) {
    emitJobProgress(sender, plugin.id, {
      videoId,
      status: 'error',
      label: error.message || `Skipped ${title}`,
      percent: 100
    })
    return { ok: false, error: error.message || 'YouTube stream preparation failed.' }
  }
}

export function register({ ipcMain, plugin, paths, getConfig, channelPrefix }) {
  if (registered) {
    return
  }
  registered = true

  if (paths?.toolsDir) {
    const pathParts = String(process.env.PATH || process.env.Path || '')
      .split(process.platform === 'win32' ? ';' : ':')
      .filter(Boolean)
    const hasToolsDir =
      process.platform === 'win32'
        ? pathParts.some((part) => part.toLowerCase() === paths.toolsDir.toLowerCase())
        : pathParts.includes(paths.toolsDir)
    if (!hasToolsDir) {
      const delimiter = process.platform === 'win32' ? ';' : ':'
      process.env.PATH = `${paths.toolsDir}${delimiter}${pathParts.join(delimiter)}`
      process.env.Path = process.env.PATH
    }
  }

  const channels = [
    `${channelPrefix}:recommend`,
    `${channelPrefix}:search`,
    `${channelPrefix}:download`
  ]
  for (const channel of channels) {
    ipcMain.removeHandler(channel)
  }

  setTimeout(() => {
    warmRecommendationCache(paths, getConfig).catch(() => {
      // Cache warming is best-effort only.
    })
  }, 2500)

  ipcMain.handle(`${channelPrefix}:recommend`, async (_event, payload) => {
    const config = getConfig()
    return listVideos(paths, config.recommendationQuery, config, {
      page: payload?.page,
      pageSize: payload?.pageSize
    })
  })

  ipcMain.handle(`${channelPrefix}:search`, async (_event, payload) => {
    const query = typeof payload === 'object' ? payload?.query : payload
    return listVideos(paths, query, getConfig(), {
      page: payload?.page,
      pageSize: payload?.pageSize
    })
  })

  ipcMain.handle(`${channelPrefix}:download`, async (event, video) => {
    return resolveDashStream({ paths, plugin, sender: event.sender, video, config: getConfig() })
  })
}
