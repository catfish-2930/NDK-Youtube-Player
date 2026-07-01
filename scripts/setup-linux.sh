#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd)"
DOWNLOAD_DIR="$PLUGIN_ROOT/vendor/downloads"
BIN_DIR="$PLUGIN_ROOT/vendor/bin"

mkdir -p "$DOWNLOAD_DIR" "$BIN_DIR"

YTDLP_URL="https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux"
YTDLP_PATH="$BIN_DIR/yt-dlp"

echo "Downloading yt-dlp..."
curl -L "$YTDLP_URL" -o "$YTDLP_PATH"
chmod +x "$YTDLP_PATH"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required from system PATH on Linux." >&2
  echo "Install it first, for example: sudo apt install ffmpeg" >&2
  exit 1
fi

"$YTDLP_PATH" --version
ffmpeg -version | head -n 1

echo "YouTube plugin Linux dependencies are ready."
