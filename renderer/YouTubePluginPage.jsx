import PropTypes from 'prop-types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Search, X, XCircle } from 'lucide-react'
import './YouTubePluginPage.css'

const LANDSCAPE_PAGE_SIZE = 10
const PORTRAIT_COLUMNS = 2

function YoutubeSuggestions({ query, locale, onSelect }) {
  const [suggestionResult, setSuggestionResult] = useState({ query: '', suggestions: [] })
  const normalizedQuery = String(query || '').trim()

  useEffect(() => {
    if (!normalizedQuery) {
      return undefined
    }

    let active = true
    const timer = setTimeout(async () => {
      try {
        const result = await window.api.plugins.invoke('plugin:youtube-player:suggest', {
          query: normalizedQuery,
          locale
        })
        if (active) {
          setSuggestionResult({
            query: normalizedQuery,
            suggestions: Array.isArray(result?.suggestions) ? result.suggestions : []
          })
        }
      } catch {
        if (active) setSuggestionResult({ query: normalizedQuery, suggestions: [] })
      }
    }, 280)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [normalizedQuery, locale])

  const suggestions =
    normalizedQuery && suggestionResult.query === normalizedQuery
      ? suggestionResult.suggestions
      : []

  return (
    <div
      className="youtube-keyword-suggestions"
      aria-label="YouTube search suggestions"
      aria-hidden={suggestions.length === 0}
    >
      {suggestions.map((suggestion) => (
        <button
          className="youtube-keyword-suggestion"
          type="button"
          key={suggestion}
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </button>
      ))}
    </div>
  )
}

YoutubeSuggestions.propTypes = {
  query: PropTypes.string.isRequired,
  locale: PropTypes.oneOf(['zh', 'en']).isRequired,
  onSelect: PropTypes.func.isRequired
}

function YouTubePluginPage({ onEnqueueMedia, onShowToast, KeyboardComponent }) {
  const [pageSize, setPageSize] = useState(null)
  const [query, setQuery] = useState('')
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [activeVideoIds, setActiveVideoIds] = useState({})
  const [jobProgress, setJobProgress] = useState({})
  const [contextMenuVideo, setContextMenuVideo] = useState(null)
  const longPressTimerRef = useRef(null)
  const didLongPressRef = useRef(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [locale, setLocale] = useState('zh')
  const videoGridRef = useRef(null)
  const activeQueryRef = useRef('')
  const loadRequestIdRef = useRef(0)

  const updatePageSize = useCallback(() => {
    const grid = videoGridRef.current
    if (!grid) return

    const portrait = Boolean(grid.closest('.main-screen-frame--portrait'))
    if (!portrait) {
      setPageSize((current) => (current === LANDSCAPE_PAGE_SIZE ? current : LANDSCAPE_PAGE_SIZE))
      return
    }

    const gridStyle = window.getComputedStyle(grid)
    const columnGap = Number.parseFloat(gridStyle.columnGap) || 0
    const rowGap = Number.parseFloat(gridStyle.rowGap) || 0
    const availableWidth = grid.clientWidth
    const availableHeight = grid.clientHeight
    if (availableWidth <= 0 || availableHeight <= 0) return

    const cardWidth = (availableWidth - columnGap * (PORTRAIT_COLUMNS - 1)) / PORTRAIT_COLUMNS
    const cardGap = Math.min(8, Math.max(5, cardWidth * 0.018))
    const metaGap = Math.min(4, Math.max(2, cardWidth * 0.009))
    const titleFontSize = Math.min(16, Math.max(12, cardWidth * 0.092))
    const artistFontSize = Math.min(13, Math.max(10, cardWidth * 0.072))
    const estimatedCardHeight =
      (cardWidth * 9) / 16 + cardGap + titleFontSize * 1.18 * 2 + metaGap + artistFontSize * 1.2
    const renderedCard = grid.querySelector('.youtube-video-card')
    const cardHeight = Math.max(estimatedCardHeight, renderedCard?.scrollHeight || 0)
    const visibleRows = Math.max(1, Math.floor((availableHeight + rowGap) / (cardHeight + rowGap)))
    const nextPageSize = visibleRows * PORTRAIT_COLUMNS

    setPageSize((current) => (current === nextPageSize ? current : nextPageSize))
  }, [])

  useEffect(() => {
    let active = true
    window.api.settings
      .get('locale', 'zh')
      .then((value) => {
        if (active && (value === 'zh' || value === 'en')) setLocale(value)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const loadVideos = useCallback(
    async (nextQuery = '', targetPage = 1) => {
      if (!pageSize) return

      const requestId = loadRequestIdRef.current + 1
      loadRequestIdRef.current = requestId
      setLoading(true)
      setMessage('')

      try {
        const channel = nextQuery
          ? 'plugin:youtube-player:search'
          : 'plugin:youtube-player:recommend'
        const payload = nextQuery
          ? { query: nextQuery, page: targetPage, pageSize }
          : { page: targetPage, pageSize }
        const result = await window.api.plugins.invoke(channel, payload)
        if (requestId !== loadRequestIdRef.current) return

        if (!result?.ok) {
          setVideos([])
          setCurrentPage(1)
          setHasNextPage(false)
          setTotalPages(1)
          setMessage(result?.error || 'YouTube plugin is not installed.')
          return
        }

        setVideos(Array.isArray(result.videos) ? result.videos : [])
        setCurrentPage(Math.max(1, Number(result.page || targetPage || 1)))
        setHasNextPage(Boolean(result.hasNext))
        setTotalPages(
          Number.isFinite(Number(result.totalPages))
            ? Math.max(1, Number(result.totalPages))
            : Math.max(1, Number(result.page || targetPage || 1))
        )
      } catch (error) {
        if (requestId !== loadRequestIdRef.current) return

        setVideos([])
        setCurrentPage(1)
        setHasNextPage(false)
        setTotalPages(1)
        setMessage(error.message || 'YouTube plugin is not installed.')
      } finally {
        if (requestId === loadRequestIdRef.current) {
          setLoading(false)
        }
      }
    },
    [pageSize]
  )

  useEffect(() => {
    const grid = videoGridRef.current
    if (!grid) return undefined

    const resizeObserver = new ResizeObserver(updatePageSize)
    resizeObserver.observe(grid)
    updatePageSize()

    return () => resizeObserver.disconnect()
  }, [updatePageSize])

  useEffect(() => {
    if (!pageSize) return

    loadVideos(activeQueryRef.current, 1)
  }, [loadVideos, pageSize])

  useEffect(() => {
    const unsubscribe = window.api.plugins.onPluginJobProgress('youtube-player', (progress) => {
      setJobProgress((prev) => {
        const next = { ...prev }
        if (progress.status === 'done' || progress.status === 'error') {
          delete next[progress.videoId]
          return next
        }
        next[progress.videoId] = progress
        return next
      })
    })

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(updatePageSize)
    return () => window.cancelAnimationFrame(animationFrame)
  }, [videos, updatePageSize])

  const handleSearch = () => {
    const nextQuery = query.trim()
    activeQueryRef.current = nextQuery
    loadVideos(nextQuery, 1)
  }

  const handleKeyboardInput = (key) => {
    if (key === 'BACKSPACE') {
      setQuery((value) => value.slice(0, -1))
      return
    }

    if (key === 'CLEAR') {
      setQuery('')
      return
    }

    if (key === 'SPACE') {
      setQuery((value) => `${value} `)
      return
    }

    setQuery((value) => `${value}${key}`)
  }

  const handleKeyboardText = (text) => {
    if (text) {
      setQuery((value) => `${value}${text}`)
    }
  }

  const handleKeyboardConfirm = () => {
    setKeyboardOpen(false)
    handleSearch()
  }

  const handlePrevPage = () => {
    if (loading || currentPage <= 1) return
    loadVideos(activeQueryRef.current, currentPage - 1)
  }

  const handleNextPage = () => {
    if (loading || !hasNextPage) return
    loadVideos(activeQueryRef.current, currentPage + 1)
  }

  const handleLongPressStart = (video) => {
    didLongPressRef.current = false
    longPressTimerRef.current = setTimeout(() => {
      didLongPressRef.current = true
      setContextMenuVideo(video)
    }, 500)
  }

  const handleLongPressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
  }

  const handleCancelDownload = async (video) => {
    setContextMenuVideo(null)
    try {
      await window.api.plugins.invoke('plugin:youtube-player:cancel', { videoId: video.id })
    } catch {
      // ignore — optimistically clear local state
    }
    setActiveVideoIds((prev) => {
      const next = { ...prev }
      delete next[video.id]
      return next
    })
    setJobProgress((prev) => {
      const next = { ...prev }
      delete next[video.id]
      return next
    })
  }

  const handlePickVideo = async (video) => {
    if (didLongPressRef.current) {
      didLongPressRef.current = false
      return
    }
    if (!video?.id || activeVideoIds[video.id]) {
      return
    }

    setActiveVideoIds((prev) => ({
      ...prev,
      [video.id]: true
    }))
    setMessage('')
    setJobProgress((prev) => {
      const next = { ...prev }
      delete next[video.id]
      return next
    })

    try {
      const result = await window.api.plugins.invoke('plugin:youtube-player:download', video)
      if (!result?.ok) {
        setMessage(result?.error || 'Stream preparation failed.')
        return
      }

      const queueResult = await onEnqueueMedia(result.mediaItem)
      if (!queueResult?.ok) {
        setMessage(queueResult?.error || 'Failed to add video to queue.')
        return
      }

      onShowToast?.(`${result.mediaItem.title} added to queue.`)
    } catch (error) {
      setMessage(error.message || 'Stream preparation failed.')
    } finally {
      setActiveVideoIds((prev) => {
        const next = { ...prev }
        delete next[video.id]
        return next
      })
    }
  }

  return (
    <section className={`youtube-plugin-page ${loading || videos.length === 0 ? 'has-state' : ''}`}>
      <div className="youtube-plugin-title">推荐榜</div>

      <div className="youtube-video-grid" ref={videoGridRef}>
        {loading ? (
          <div className="youtube-state youtube-loading-state">
            <span className="youtube-spinner" aria-hidden="true" />
            <span>Loading...</span>
          </div>
        ) : videos.length === 0 ? (
          <div className="youtube-state">
            {message || 'No videos. Install the YouTube plugin or try another search.'}
          </div>
        ) : (
          videos.map((video) => {
            const progress = jobProgress[video.id]
            const isActive = Boolean(activeVideoIds[video.id])

            return (
              <button
                className="youtube-video-card"
                type="button"
                key={video.id}
                disabled={isActive}
                onClick={() => handlePickVideo(video)}
                onMouseDown={() => handleLongPressStart(video)}
                onMouseUp={handleLongPressEnd}
                onMouseLeave={handleLongPressEnd}
                onTouchStart={() => handleLongPressStart(video)}
                onTouchEnd={handleLongPressEnd}
                onTouchCancel={handleLongPressEnd}
              >
                <div className={`youtube-video-thumb ${progress ? 'has-progress' : ''}`}>
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt=""
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : null}
                  {video.isLive ? (
                    <span className="youtube-content-badge live">LIVE</span>
                  ) : video.isMusic ? (
                    <span className="youtube-content-badge music">MUSIC</span>
                  ) : null}
                  {progress ? (
                    <span className={`youtube-video-progress ${progress.status || ''}`}>
                      <span className="youtube-video-progress-meta">
                        <span>{progress.speed || progress.status || ''}</span>
                        <span>
                          {Math.max(0, Math.min(100, Math.round(progress.percent || 0)))}%
                        </span>
                      </span>
                      <span className="youtube-video-progress-track">
                        <span
                          style={{ width: `${Math.max(0, Math.min(100, progress.percent || 0))}%` }}
                        />
                      </span>
                    </span>
                  ) : null}
                </div>
                <div className="youtube-video-meta">
                  <div className="youtube-video-name">{video.title}</div>
                  <div className="youtube-video-artist">{video.artist || '-'}</div>
                </div>
              </button>
            )
          })
        )}
        {!loading && videos.length > 0 && message ? (
          <div className="youtube-state youtube-message-state">{message}</div>
        ) : null}
      </div>

      <div className="youtube-plugin-footer">
        <div className="youtube-search-wrap">
          <input
            className="youtube-search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClick={() => setKeyboardOpen(true)}
            onFocus={() => setKeyboardOpen(true)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleSearch()
            }}
            inputMode="none"
            placeholder="请输入字母 / YOUTUBE ID 搜索"
          />
          <button className="youtube-search-button" type="button" onClick={handleSearch}>
            <Search size={34} />
          </button>
        </div>

        <div className="youtube-pagination">
          <button type="button" disabled={loading || currentPage <= 1} onClick={handlePrevPage}>
            <ChevronLeft size={22} />
            上一页
          </button>
          <span>
            {currentPage} / {hasNextPage ? '...' : totalPages}
          </span>
          <button type="button" disabled={loading || !hasNextPage} onClick={handleNextPage}>
            下一页
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      <div className="youtube-disclaimer">
        免责声明：YouTube
        功能仅作为实验用途，无法确保播放成功；播放效果可能会因内容限制、网络状况或平台兼容性而有所差异。
      </div>

      {contextMenuVideo ? (
        <div className="youtube-context-overlay" onClick={() => setContextMenuVideo(null)}>
          <div className="youtube-context-menu" onClick={(e) => e.stopPropagation()}>
            <div className="youtube-context-menu-thumb">
              {contextMenuVideo.thumbnail ? (
                <img src={contextMenuVideo.thumbnail} alt="" referrerPolicy="no-referrer" />
              ) : null}
            </div>
            <div className="youtube-context-menu-title">{contextMenuVideo.title}</div>
            <div className="youtube-context-menu-actions">
              {activeVideoIds[contextMenuVideo.id] ? (
                <button
                  className="youtube-context-option danger"
                  type="button"
                  onClick={() => handleCancelDownload(contextMenuVideo)}
                >
                  <XCircle size={18} />
                  取消下载
                </button>
              ) : null}
              <button
                className="youtube-context-option"
                type="button"
                onClick={() => setContextMenuVideo(null)}
              >
                <X size={18} />
                关闭
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {KeyboardComponent ? (
        <KeyboardComponent
          visible={keyboardOpen}
          onKey={handleKeyboardInput}
          onText={handleKeyboardText}
          onConfirm={handleKeyboardConfirm}
          displayValue={query}
          inputAccessory={
            <YoutubeSuggestions
              query={query}
              locale={locale}
              onSelect={(suggestion) => setQuery(suggestion)}
            />
          }
        />
      ) : null}
    </section>
  )
}

YouTubePluginPage.propTypes = {
  onEnqueueMedia: PropTypes.func.isRequired,
  onShowToast: PropTypes.func,
  KeyboardComponent: PropTypes.elementType
}

export default YouTubePluginPage
