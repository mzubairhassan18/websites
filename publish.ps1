<#
.SYNOPSIS
  Publishes every site in sites/<name>/ to the `gh-pages` branch,
  which is what GitHub Pages serves from.

.DESCRIPTION
  Use this when GitHub Actions is unavailable (e.g. the account-level
  billing lock that blocks workflow jobs even on a free plan).
  Publishing to a public repo is otherwise free.

  What it does:
    1. Assembles _site/   (root site + every sites/*/ folder)
    2. Checks out an orphan worktree so your working tree is untouched
    3. Force-pushes _site/ as the entire content of gh-pages
    4. Triggers a Pages build and waits for it

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\publish.ps1
#>
[CmdletBinding()]
param(
    [string]$RepoRoot,
    [string]$Remote   = 'origin',
    [string]$Branch   = 'gh-pages'
)

$ErrorActionPreference = 'Stop'
# $PSScriptRoot is not reliably available inside param() defaults.
if ([string]::IsNullOrWhiteSpace($RepoRoot)) { $RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path }
Set-Location $RepoRoot

function Step($msg) { Write-Host "==> $msg" -ForegroundColor Cyan }

# ---------------------------------------------------------------- 1. build
Step "Assembling _site/"
$site = Join-Path $RepoRoot '_site'
if (Test-Path $site) { Remove-Item $site -Recurse -Force }
New-Item -ItemType Directory -Path $site | Out-Null

foreach ($f in 'index.html', 'styles.css', 'app.js', 'assets') {
    $p = Join-Path $RepoRoot $f
    if (Test-Path $p) { Write-Host "    root: $f"; Copy-Item $p $site -Recurse }
}

$sitesDir = Join-Path $RepoRoot 'sites'
$subSites = @()
if (Test-Path $sitesDir) {
    foreach ($d in Get-ChildItem $sitesDir -Directory) {
        if (Test-Path (Join-Path $d.FullName 'index.html')) {
            Write-Host "    site: $($d.Name)"
            Copy-Item $d.FullName (Join-Path $site $d.Name) -Recurse
            # repo docs stay in git, but are not published with the site
            foreach ($doc in 'RESEARCH.md', 'README.md') {
                $t = Join-Path (Join-Path $site $d.Name) $doc
                if (Test-Path $t) { Remove-Item $t -Force }
            }
            $subSites += $d.Name
        }
    }
}

# Root landing page only when the repo has no site of its own at the root.
if (-not (Test-Path (Join-Path $site 'index.html')) -and $subSites.Count -gt 0) {
    $links = ($subSites | ForEach-Object { "<a href=`"./$_/`">$_</a>" }) -join "`n"
    @"
<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sites</title><style>
body{font-family:system-ui,sans-serif;background:#0f1115;color:#e8eaed;margin:0;padding:64px 24px}
h1{font-weight:600}
a{display:block;padding:14px 16px;background:#1a1d24;border:1px solid #262a33;border-radius:10px;color:#e8eaed;text-decoration:none;margin-bottom:10px;max-width:420px}
a:hover{border-color:#3d434f}
</style></head><body><h1>Sites</h1>
$links
</body></html>
"@ | Set-Content -Path (Join-Path $site 'index.html') -Encoding UTF8 -NoNewline
}

# GitHub Pages must serve files as-is, with no Jekyll processing.
New-Item -Path (Join-Path $site '.nojekyll') -ItemType File -Force | Out-Null
Write-Host "    $((Get-ChildItem $site -Recurse -File).Count) files built"

# ------------------------------------------------- 2. isolated worktree
Step "Preparing worktree (working tree stays untouched)"
$work = Join-Path ([System.IO.Path]::GetTempPath()) ("ghpages-" + [guid]::NewGuid().ToString('N'))

# Use the existing $Branch when it exists; otherwise create it as an orphan.
$refPath = "refs/heads/$Branch"
git show-ref --verify --quiet $refPath
$hasBranch = ($LASTEXITCODE -eq 0)
if ($hasBranch) {
    git worktree add --quiet $work $Branch
}
else {
    git worktree add --quiet --detach $work HEAD
    Push-Location $work
    git checkout --quiet --orphan $Branch
    Pop-Location
}

try {
    Push-Location $work

    # Start from an empty tree so only _site/ content ships.
    git rm -rq --cached . 2>$null | Out-Null
    Get-ChildItem -Force |
        Where-Object { $_.Name -ne '.git' } |
        Remove-Item -Recurse -Force

    Copy-Item (Join-Path $site '*') $work -Recurse -Force
    Copy-Item (Join-Path $site '.nojekyll') $work -Force
    git add -A

    if (-not (git status --porcelain)) {
        Write-Host "    no changes" -ForegroundColor Yellow
    }
    else {
        Step "Committing and pushing to $Branch"
        git -c user.name='publish' -c user.email='publish@localhost' `
            commit -q -m "Publish sites from $(git rev-parse --short HEAD)"
        $key = Join-Path $env:USERPROFILE '.ssh\id_ed25519_personal'
        if (Test-Path $key) {
            $env:GIT_SSH_COMMAND = "ssh -i `"$key`" -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"
        }
        git push --force $Remote $Branch
    }
}
finally {
    Pop-Location -ErrorAction SilentlyContinue
    Set-Location $RepoRoot
    git worktree remove --force $work 2>$null | Out-Null
    git worktree prune 2>$null | Out-Null
    Remove-Item $site -Recurse -Force -ErrorAction SilentlyContinue
}

# ------------------------------------------------------------ 3. rebuild
Step "Triggering GitHub Pages build"
try {
    $b = gh api -X POST "repos/mzubairhassan18/websites/pages/builds" 2>$null | ConvertFrom-Json
    Write-Host "    queued: $($b.status)"
    for ($i = 0; $i -lt 20; $i++) {
        Start-Sleep -Seconds 5
        $s = gh api "repos/mzubairhassan18/websites/pages/builds/latest" 2>$null | ConvertFrom-Json
        if ($s.status -and $s.status -ne 'building' -and $s.status -ne 'queued') { break }
    }
    Write-Host "    status: $($s.status)" -ForegroundColor Green
}
catch {
    Write-Host "    could not trigger build automatically" -ForegroundColor Yellow
    Write-Host "    -> gh api -X POST repos/<owner>/websites/pages/builds"
}

Write-Host "`nLive:" -ForegroundColor Green
Write-Host "  https://mzubairhassan18.github.io/websites/mrmechanic/"
