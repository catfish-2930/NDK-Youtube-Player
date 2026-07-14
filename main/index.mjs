import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'fs'
import { mkdir, readdir, rm } from 'fs/promises'
import { basename, join } from 'path'
import { spawn } from 'child_process'
import { get as httpsGet } from 'https'

let registered = false
const sessionState = (globalThis.__karaokeYoutubePlayerSessionState ||= {
  cleanedOnStartup: false,
  mediaCache: new Map(),
  toolsReadyByPath: new Map(),
  searchStates: new Map()
})
const SEARCH_CACHE_TTL_MS = 10 * 60 * 1000
const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 20
const MAX_FETCH_RESULTS = 120
const MAX_CACHED_MEDIA = 10
const mediaCache = sessionState.mediaCache
const toolsReadyByPath =
  sessionState.toolsReadyByPath || (sessionState.toolsReadyByPath = new Map())
const searchStates = sessionState.searchStates || (sessionState.searchStates = new Map())
const YOUTUBE_ORIGIN = 'https://www.youtube.com'
const YOUTUBE_VIDEO_SEARCH_PARAMS = 'EgIQAfABAQ=='
const YOUTUBE_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138 Safari/537.36'

function ensureDir(dirPath) {
  mkdirSync(dirPath, { recursive: true })
}

function getCleanEnv() {
  const env = { ...process.env }
  // Keep yt-dlp isolated from any preload hooks that may be present in the app process.
  delete env.LD_PRELOAD
  return env
}

function findExecutableFile(candidates) {
  for (const candidate of candidates.filter(Boolean)) {
    try {
      if (existsSync(candidate) && statSync(candidate).isFile()) return candidate
    } catch {
      // Try the next candidate.
    }
  }
  return ''
}

function getTools(paths) {
  const sharedYtdlp = findExecutableFile([paths.ytdlpExecutablePath])

  return {
    ytdlp: sharedYtdlp
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

  if (!tools.ytdlp) {
    return { ok: false, error: 'YouTube Player requires NDK-yt-dlp. Install it first.' }
  }

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    if (await canRunCommand(tools.ytdlp, ['--version'])) {
      toolsReadyByPath.set(tools.ytdlp, { ok: true, checkedAt: Date.now() })
      return { ok: true, tools }
    }
    if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  toolsReadyByPath.delete(tools.ytdlp)
  return { ok: false, error: 'YouTube Player requires NDK-yt-dlp. Install it first.' }
}

async function readCommandText(command, args) {
  try {
    const result = await runProcess(command, args, { timeoutMs: 5000 })
    return {
      ok: true,
      text: String(result.stdout || '').trim()
    }
  } catch (error) {
    return {
      ok: false,
      error: error?.message || `${basename(command)} failed.`
    }
  }
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const request = httpsGet(
      url,
      {
        headers: {
          'user-agent': 'karaoke-system-youtube-plugin'
        }
      },
      (response) => {
        if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
          response.resume()
          fetchJson(response.headers.location).then(resolve, reject)
          return
        }

        if (response.statusCode !== 200) {
          response.resume()
          reject(new Error(`Version check failed with HTTP ${response.statusCode}`))
          return
        }

        let body = ''
        response.setEncoding('utf8')
        response.on('data', (chunk) => {
          body += chunk
        })
        response.on('end', () => {
          try {
            resolve(JSON.parse(body))
          } catch (error) {
            reject(error)
          }
        })
      }
    )

    request.setTimeout(12000, () => {
      request.destroy(new Error('Version check timed out.'))
    })
    request.on('error', reject)
  })
}

async function checkYtdlpUpdate(paths) {
  try {
    const version = await getYtdlpVersion(paths)
    if (!version.ok) {
      return version
    }

    const latestRelease = await fetchJson(
      'https://api.github.com/repos/yt-dlp/yt-dlp/releases/latest'
    )
    const latestVersion = String(latestRelease?.tag_name || '')
      .replace(/^yt-dlp@/, '')
      .trim()

    return {
      ...version,
      latestVersion,
      upToDate: Boolean(latestVersion) && version.currentVersion === latestVersion
    }
  } catch (error) {
    return {
      ok: false,
      error: error.message || 'Failed to check yt-dlp version.'
    }
  }
}

async function getYtdlpVersion(paths) {
  const tools = getTools(paths)
  const current = await readCommandText(tools.ytdlp, ['--version'])
  if (!current.ok) {
    return { ok: false, error: 'NDK-yt-dlp is not installed. Install it first.' }
  }

  const currentVersion = current.text.split(/\s+/)[0]

  return {
    ok: true,
    tool: 'yt-dlp',
    currentVersion
  }
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
    .map((item) => {
      const liveStatus = String(item.live_status || '').toLowerCase()
      const categories = Array.isArray(item.categories) ? item.categories : []
      const musicMetadata = [item.genre, item.album, item.track, ...categories]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      const isLive = Boolean(item.is_live) || ['is_live', 'is_upcoming'].includes(liveStatus)
      const hasMusicFields = Boolean(item.track || item.album || item.artist)
      const isMusic = !isLive && (hasMusicFields || /(^|\W)music(\W|$)/i.test(musicMetadata))

      return {
        id: item.id,
        title: item.title || item.fulltitle || item.id,
        artist: item.artist || item.uploader || item.channel || '',
        thumbnail: item.thumbnail || item.thumbnails?.at?.(-1)?.url || '',
        webpageUrl:
          item.webpage_url ||
          item.url ||
          (item.id ? `https://www.youtube.com/watch?v=${item.id}` : ''),
        duration: item.duration || null,
        isLive,
        isMusic
      }
    })
    .filter((item) => item.id && item.webpageUrl)
}

function getSearchKey(query) {
  return String(query || '').toLocaleLowerCase().trim()
}

function getText(value) {
  if (typeof value === 'string') return value
  if (typeof value?.simpleText === 'string') return value.simpleText
  if (Array.isArray(value?.runs)) return value.runs.map((run) => run?.text || '').join('')
  return ''
}

function parseDuration(value) {
  const parts = getText(value)
    .trim()
    .split(':')
    .map(Number)
  if (!parts.length || parts.some((part) => !Number.isFinite(part))) return null
  return parts.reduce((total, part) => total * 60 + part, 0)
}

function findJsonObject(source, marker) {
  let markerIndex = source.indexOf(marker)
  while (markerIndex >= 0) {
    const start = source.indexOf('{', markerIndex + marker.length)
    if (start < 0) return null

    let depth = 0
    let inString = false
    let escaped = false
    for (let index = start; index < source.length; index += 1) {
      const character = source[index]
      if (inString) {
        if (escaped) escaped = false
        else if (character === '\\') escaped = true
        else if (character === '"') inString = false
        continue
      }
      if (character === '"') inString = true
      else if (character === '{') depth += 1
      else if (character === '}') {
        depth -= 1
        if (depth === 0) {
          try {
            return JSON.parse(source.slice(start, index + 1))
          } catch {
            break
          }
        }
      }
    }
    markerIndex = source.indexOf(marker, markerIndex + marker.length)
  }
  return null
}

function findObjects(value, key, results = []) {
  if (!value || typeof value !== 'object') return results
  if (Array.isArray(value)) {
    for (const item of value) findObjects(item, key, results)
    return results
  }
  if (value[key] && typeof value[key] === 'object') results.push(value[key])
  for (const item of Object.values(value)) findObjects(item, key, results)
  return results
}

function parseYoutubeVideos(data) {
  const seen = new Set()
  return findObjects(data, 'videoRenderer')
    .map((renderer) => {
      const id = String(renderer.videoId || '')
      if (!id || seen.has(id)) return null
      seen.add(id)
      const thumbnails = renderer.thumbnail?.thumbnails || []
      return {
        id,
        title: getText(renderer.title) || id,
        artist: getText(renderer.ownerText) || getText(renderer.longBylineText) || getText(renderer.shortBylineText),
        thumbnail: thumbnails.at(-1)?.url || '',
        webpageUrl: `${YOUTUBE_ORIGIN}/watch?v=${id}`,
        duration: Number(renderer.lengthSeconds) || parseDuration(renderer.lengthText)
      }
    })
    .filter(Boolean)
}

function extractContinuation(data) {
  const renderer = findObjects(data, 'continuationItemRenderer')[0]
  return String(renderer?.continuationEndpoint?.continuationCommand?.token || '')
}

function getYoutubeHeaders(clientVersion, visitorData) {
  return {
    'user-agent': YOUTUBE_USER_AGENT,
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/json',
    'x-youtube-client-name': '1',
    'x-youtube-client-version': clientVersion,
    ...(visitorData ? { 'x-goog-visitor-id': visitorData } : {})
  }
}

async function fetchYoutubeSearchPage(query) {
  const url = new URL('/results', YOUTUBE_ORIGIN)
  url.searchParams.set('search_query', query)
  url.searchParams.set('sp', YOUTUBE_VIDEO_SEARCH_PARAMS)
  const response = await fetch(url, {
    headers: {
      'user-agent': YOUTUBE_USER_AGENT,
      'accept-language': 'en-US,en;q=0.9'
    },
    signal: AbortSignal.timeout(10000)
  })
  if (!response.ok) throw new Error(`YouTube search failed (${response.status}).`)

  const html = await response.text()
  const data = findJsonObject(html, 'var ytInitialData = ')
  const config = findJsonObject(html, 'ytcfg.set(')
  const apiKey = String(config?.INNERTUBE_API_KEY || '')
  const clientVersion = String(config?.INNERTUBE_CLIENT_VERSION || '')
  if (!data || !apiKey || !clientVersion) {
    throw new Error('YouTube returned an unsupported search response.')
  }
  return {
    videos: parseYoutubeVideos(data),
    continuation: extractContinuation(data),
    apiKey,
    clientVersion,
    visitorData: String(config?.VISITOR_DATA || '')
  }
}

async function fetchYoutubeContinuation(state) {
  if (!state.continuation || !state.apiKey || !state.clientVersion) return null
  const response = await fetch(`${YOUTUBE_ORIGIN}/youtubei/v1/search?key=${state.apiKey}`, {
    method: 'POST',
    headers: getYoutubeHeaders(state.clientVersion, state.visitorData),
    body: JSON.stringify({
      context: {
        client: {
          clientName: 'WEB',
          clientVersion: state.clientVersion,
          hl: 'en',
          gl: 'MY',
          ...(state.visitorData ? { visitorData: state.visitorData } : {})
        }
      },
      continuation: state.continuation
    }),
    signal: AbortSignal.timeout(10000)
  })
  if (!response.ok) throw new Error(`YouTube next page failed (${response.status}).`)
  const data = await response.json()
  return {
    videos: parseYoutubeVideos(data),
    continuation: extractContinuation(data)
  }
}

async function getYoutubeSearchState(paths, query, neededCount) {
  const key = getSearchKey(query)
  let state = searchStates.get(key)
  if (!state) {
    state = {
      videos: readSearchCache(paths, query) || [],
      continuation: '',
      apiKey: '',
      clientVersion: '',
      visitorData: ''
    }
    searchStates.set(key, state)
  }

  const targetCount = Math.min(MAX_FETCH_RESULTS, neededCount)
  while (state.videos.length < targetCount) {
    const previousContinuation = state.continuation
    const page = state.apiKey ? await fetchYoutubeContinuation(state) : await fetchYoutubeSearchPage(query)
    if (!page) break
    if (!state.apiKey) {
      state.apiKey = page.apiKey
      state.clientVersion = page.clientVersion
      state.visitorData = page.visitorData
    }
    const knownIds = new Set(state.videos.map((video) => video.id))
    const newVideos = page.videos.filter((video) => !knownIds.has(video.id))
    state.videos.push(...newVideos)
    state.continuation = page.continuation
    if (!state.continuation || (!newVideos.length && state.continuation === previousContinuation)) break
  }

  writeSearchCache(paths, query, state.videos)
  return state
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

  let state
  let cached = false
  try {
    state = await getYoutubeSearchState(paths, searchQuery, neededCount)
    cached = state.videos.length >= neededCount && !state.apiKey
  } catch (youtubeError) {
    // Search should normally use YouTube's web response directly. Keep yt-dlp as a
    // compatibility fallback when YouTube changes that response format.
    const ready = await assertToolsReady(paths)
    if (!ready.ok) {
      return { ok: false, error: youtubeError.message || ready.error }
    }
    const fetchCount = Math.min(MAX_FETCH_RESULTS, Math.max(neededCount, DEFAULT_PAGE_SIZE * 3))
    const result = await runProcess(ready.tools.ytdlp, [
      '--dump-json',
      '--flat-playlist',
      '--no-warnings',
      '--playlist-end',
      String(fetchCount),
      `ytsearch${fetchCount}:${searchQuery}`
    ])
    state = { videos: parseVideoJsonLines(result.stdout), continuation: '' }
    writeSearchCache(paths, searchQuery, state.videos)
  }

  const videos = state.videos.slice(startIndex, endIndex)
  const hasNext = state.videos.length > endIndex || Boolean(state.continuation)
  const totalPages = hasNext ? null : Math.max(1, Math.ceil(state.videos.length / pageSize))

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

async function removePathIfPossible(targetPath) {
  try {
    await rm(targetPath, { recursive: true, force: true })
    return true
  } catch (error) {
    if (['EBUSY', 'EPERM', 'ENOTEMPTY'].includes(error?.code)) {
      return false
    }
    throw error
  }
}

async function clearDirectoryFiles(dirPath) {
  if (!existsSync(dirPath)) {
    return {
      removed: 0,
      skipped: 0
    }
  }

  let removed = 0
  let skipped = 0
  const names = await readdir(dirPath)
  for (const name of names) {
    const targetPath = join(dirPath, name)
    if (await removePathIfPossible(targetPath)) {
      removed += 1
    } else {
      skipped += 1
    }
  }

  return {
    removed,
    skipped
  }
}

async function cleanupPluginMedia(paths) {
  await mkdir(paths.rawDownloadsDir, { recursive: true })
  await mkdir(paths.convertedDir, { recursive: true })
  mediaCache.clear()

  const [downloadCleanup, convertedCleanup] = await Promise.all([
    clearDirectoryFiles(paths.rawDownloadsDir),
    clearDirectoryFiles(paths.convertedDir)
  ])

  return {
    ok: true,
    removedDownloads: downloadCleanup.removed,
    removedConverted: convertedCleanup.removed,
    skippedDownloads: downloadCleanup.skipped,
    skippedConverted: convertedCleanup.skipped,
    removedTotal: downloadCleanup.removed + convertedCleanup.removed,
    skippedTotal: downloadCleanup.skipped + convertedCleanup.skipped
  }
}

function buildMediaItem(pluginId, videoId, title, artist, source) {
  return {
    title,
    artist,
    path: source.webpageUrl || source.videoUrl || '',
    mediaSource: source,
    sourcePluginId: pluginId,
    externalId: videoId,
    thumbnail: source.thumbnail || ''
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
  const height = normalizeMaxVideoHeight(maxVideoHeight)
  return `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`
}

function normalizeMaxVideoHeight(value) {
  const height = Number(value || 1080)
  return [480, 720, 1080, 1440, 2160].includes(height) ? height : 1080
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
  const thumbnail = String(video?.thumbnail || '').trim()
  const isLive = Boolean(video?.isLive)
  const isMusic = Boolean(video?.isMusic)

  if (!videoId || !url) {
    return { ok: false, error: 'Invalid YouTube video.' }
  }

  ensureDir(paths.cacheDir)

  const maxVideoHeight = normalizeMaxVideoHeight(config.maxVideoHeight)
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
      ytdlPath: ready.tools.ytdlp,
      thumbnail,
      isLive,
      isMusic
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

  const channels = [
    `${channelPrefix}:recommend`,
    `${channelPrefix}:search`,
    `${channelPrefix}:download`,
    `${channelPrefix}:cancel`,
    `${channelPrefix}:cleanupMedia`,
    `${channelPrefix}:getYtdlpVersion`,
    `${channelPrefix}:checkYtdlpUpdate`
  ]
  for (const channel of channels) {
    ipcMain.removeHandler(channel)
  }

  if (!sessionState.cleanedOnStartup) {
    sessionState.cleanedOnStartup = true
    setTimeout(() => {
      cleanupPluginMedia(paths).catch(() => {
        // Startup cleanup is best-effort; user-triggered cleanup reports errors.
      })
    }, 1500)
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

  ipcMain.handle(`${channelPrefix}:cancel`, async (_event, payload) => {
    const videoId = String(payload?.videoId || '').trim()
    if (videoId) mediaCache.delete(videoId)
    return { ok: true, videoId }
  })

  ipcMain.handle(`${channelPrefix}:cleanupMedia`, async () => {
    return cleanupPluginMedia(paths)
  })

  ipcMain.handle(`${channelPrefix}:getYtdlpVersion`, async () => {
    return getYtdlpVersion(paths)
  })

  ipcMain.handle(`${channelPrefix}:checkYtdlpUpdate`, async () => {
    return checkYtdlpUpdate(paths)
  })
}

export async function prepareStartup({ paths }) {
  return assertToolsReady(paths)
}
