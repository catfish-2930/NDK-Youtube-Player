# YouTube Player Plugin

This is an independent plugin project. It searches YouTube with the separate `ytdlp` plugin and queues playable mpv `libmpv-ytdl` media sources.

## Runtime

- Requires the `ytdlp` plugin to be installed.
- Does not bundle or invoke local transcoding tools.
- Does not download or convert media files locally.
- Uses `plugins/workspace/youtube-player/cache` for search metadata cache.

## Flow

1. Search YouTube through the `ytdlp` plugin executable.
2. Build an mpv `libmpv-ytdl` media source for the selected video.
3. Queue the media source through the host queue API.
