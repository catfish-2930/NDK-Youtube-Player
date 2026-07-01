# YouTube Player Plugin

This is an independent plugin project. It has its own Git repository and is not considered installed by the karaoke host until it is copied or released into `plugins/installed/youtube-player`.

## Windows Tool Layout

- `vendor/bin/yt-dlp.exe`
- `vendor/bin/ffmpeg.exe`
- `vendor/bin/ffprobe.exe`
- `vendor/downloads/` for downloaded archives

## Linux Tool Layout

- `vendor/bin/yt-dlp`
- `ffmpeg` from the system PATH
- `vendor/downloads/` for downloaded files

For local Linux setup, run `plugins/projects/youtube-player/scripts/setup-linux.sh`.

## Runtime Workspace

When installed, the plugin should use:

- `plugins/workspace/youtube-player/downloads` for raw YouTube downloads
- `plugins/workspace/youtube-player/converted` for MP4 output
- `plugins/workspace/youtube-player/cache` for metadata and thumbnails

## Planned Flow

1. Search YouTube or accept a YouTube ID.
2. Download with `yt-dlp`, capped at 1080p.
3. Convert to MP4 with `ffmpeg`.
4. Keep one audio track in the converted MP4.
5. Call the host queue API with the converted MP4 path.
