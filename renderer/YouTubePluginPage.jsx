import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Download, Search, X } from 'lucide-react'
import './YouTubePluginPage.css'

function YouTubePluginPage({ onEnqueueMedia, KeyboardComponent }) {
  const pageSize = 10
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

  const loadVideos = async (nextQuery = '', targetPage = 1) => {
    setLoading(true)
    setMessage('')

    try {
      const channel = nextQuery ? 'plugin:youtube-player:search' : 'plugin:youtube-player:recommend'
      const payload = nextQuery
        ? { query: nextQuery, page: targetPage, pageSize }
        : { page: targetPage, pageSize }
      const result = await window.api.plugins.invoke(channel, payload)
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
      setVideos([])
      setCurrentPage(1)
      setHasNextPage(false)
      setTotalPages(1)
      setMessage(error.message || 'YouTube plugin is not installed.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let alive = true

    loadVideos('', 1).catch(() => {
      if (!alive) return
      setLoading(false)
    })

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
      alive = false
      unsubscribe()
    }
  }, [])

  const handleSearch = () => {
    loadVideos(query.trim(), 1)
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
    loadVideos(query.trim(), currentPage - 1)
  }

  const handleNextPage = () => {
    if (loading || !hasNextPage) return
    loadVideos(query.trim(), currentPage + 1)
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

      setMessage(`${result.mediaItem.title} added to queue.`)
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

      <div className="youtube-video-grid">
        {loading ? (
          <div className="youtube-state youtube-loading-state">
            <span className="youtube-spinner" aria-hidden="true" />
            <span>Loading YouTube videos...</span>
          </div>
        ) : videos.length === 0 ? (
          <div className="youtube-state">
            No videos. Install the YouTube plugin or try another search.
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
                  <span className="youtube-video-action">
                    <Download size={18} />
                    {isActive ? '处理中' : '下载'}
                  </span>
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
        <div
          className="youtube-context-overlay"
          onClick={() => setContextMenuVideo(null)}
        >
          <div
            className="youtube-context-menu"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="youtube-context-menu-thumb">
              {contextMenuVideo.thumbnail ? (
                <img
                  src={contextMenuVideo.thumbnail}
                  alt=""
                  referrerPolicy="no-referrer"
                />
              ) : null}
            </div>
            <div className="youtube-context-menu-title">{contextMenuVideo.title}</div>
            <div className="youtube-context-menu-actions">
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
      {message ? <div className="youtube-toast">{message}</div> : null}
      {KeyboardComponent ? (
        <KeyboardComponent
          visible={keyboardOpen}
          onKey={handleKeyboardInput}
          onText={handleKeyboardText}
          onConfirm={handleKeyboardConfirm}
          displayValue={query}
        />
      ) : null}
    </section>
  )
}

YouTubePluginPage.propTypes = {
  onEnqueueMedia: PropTypes.func.isRequired,
  KeyboardComponent: PropTypes.elementType
}

export default YouTubePluginPage
