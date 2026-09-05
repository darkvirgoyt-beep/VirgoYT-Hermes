$ErrorActionPreference = 'Stop'
$root = Join-Path $HOME '.virgoyt-hermes'
New-Item -ItemType Directory -Force -Path $root | Out-Null

node --version | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Node.js 18+ is required. Install it from https://nodejs.org/ and rerun this script.' }

$repo = Join-Path $root 'VirgoYT-Hermes'
if (-not (Test-Path (Join-Path $repo 'bridge'))) {
  git clone --depth 1 https://github.com/darkvirgoyt-beep/VirgoYT-Hermes.git $repo
} else {
  git -C $repo pull --ff-only
}

Write-Host 'Hybrid Hermes bridge installed.'
Write-Host '1. In Hybrid Hermes, create a computer pairing code.'
Write-Host '2. Run: $env:HERMES_PAIRING_CODE="123456"; node "$HOME\.virgoyt-hermes\VirgoYT-Hermes\bridge\cli.mjs" start'
Write-Host '3. Replace 123456 with the code shown by the app.'
Write-Host '4. Emergency stop: node "$HOME\.virgoyt-hermes\VirgoYT-Hermes\bridge\cli.mjs" stop'
