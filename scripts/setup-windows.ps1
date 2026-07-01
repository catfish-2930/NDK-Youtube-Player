$ErrorActionPreference = 'Stop'

$pluginRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$downloadDir = Join-Path $pluginRoot 'vendor\downloads'
$binDir = Join-Path $pluginRoot 'vendor\bin'
$extractDir = Join-Path $pluginRoot 'vendor\ffmpeg-extract'

New-Item -ItemType Directory -Force -Path $downloadDir, $binDir, $extractDir | Out-Null

$ytDlpUrl = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe'
$ytDlpPath = Join-Path $binDir 'yt-dlp.exe'
Invoke-WebRequest -Uri $ytDlpUrl -OutFile $ytDlpPath

$ffmpegUrl = 'https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip'
$ffmpegZip = Join-Path $downloadDir 'ffmpeg-master-latest-win64-gpl.zip'
Invoke-WebRequest -Uri $ffmpegUrl -OutFile $ffmpegZip

if (Test-Path $extractDir) {
  Remove-Item -LiteralPath $extractDir -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $extractDir | Out-Null
Expand-Archive -LiteralPath $ffmpegZip -DestinationPath $extractDir -Force

$ffmpegExe = Get-ChildItem -Path $extractDir -Recurse -Filter 'ffmpeg.exe' | Select-Object -First 1
$ffprobeExe = Get-ChildItem -Path $extractDir -Recurse -Filter 'ffprobe.exe' | Select-Object -First 1

if (-not $ffmpegExe) {
  throw 'ffmpeg.exe was not found in the downloaded archive.'
}

Copy-Item -LiteralPath $ffmpegExe.FullName -Destination (Join-Path $binDir 'ffmpeg.exe') -Force
if ($ffprobeExe) {
  Copy-Item -LiteralPath $ffprobeExe.FullName -Destination (Join-Path $binDir 'ffprobe.exe') -Force
}

& $ytDlpPath --version
& (Join-Path $binDir 'ffmpeg.exe') -version
