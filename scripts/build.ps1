param(
  [string]$TargetRoot = "C:\Discord Bots",
  [switch]$IncludeDb
)

$ErrorActionPreference = "Stop"

$projectName = Split-Path -Leaf (Resolve-Path ".")
$dest = Join-Path $TargetRoot $projectName

Write-Host "Building to: $dest"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

$includeDirs = @(
  "client",
  "commands",
  "data",
  "handlers",
  "jobs",
  "scripts",
  "services",
  "util"
)

$includeFiles = @(
  "bot.js",
  "shardmanager.js",
  "package.json",
  "package-lock.json",
  "README.md",
  "config.example.json"
)

function Copy-Dir($srcDir, $dstDir) {
  if (!(Test-Path $srcDir)) { return }
  New-Item -ItemType Directory -Force -Path $dstDir | Out-Null

  robocopy $srcDir $dstDir /E /NFL /NDL /NJH /NJS /NP `
    /XD node_modules .git logs `
    /XF config.json *.log *.sqlite3 *.sqlite3-wal *.sqlite3-shm *.db *.sqlite *-wal *-shm *-journal |
    Out-Null
}

# Copy directories
foreach ($d in $includeDirs) {
  Copy-Dir (Join-Path "." $d) (Join-Path $dest $d)
}

# Copy root files
foreach ($f in $includeFiles) {
  $src = Join-Path "." $f
  if (Test-Path $src) {
    Copy-Item $src -Destination (Join-Path $dest $f) -Force
  }
}

# Optionally include DB
if ($IncludeDb) {
  $db = ".\data\db.sqlite3"
  if (Test-Path $db) {
    New-Item -ItemType Directory -Force -Path (Join-Path $dest "data") | Out-Null
    Copy-Item $db -Destination (Join-Path $dest "data\db.sqlite3") -Force
    Write-Host "Included DB: data\db.sqlite3"
  } else {
    Write-Warning "IncludeDb specified but no data\db.sqlite3 found."
  }
}

# ---------------------------
# Intelligent config merge
# ---------------------------

function ConvertFrom-JsonFile([string]$Path) {
  if (!(Test-Path $Path)) { return $null }
  $raw = Get-Content -LiteralPath $Path -Raw
  if ([string]::IsNullOrWhiteSpace($raw)) { return $null }
  return $raw | ConvertFrom-Json -Depth 100
}

function Is-PlainObject($v) {
  return ($null -ne $v) -and ($v -is [pscustomobject])
}

function Add-MissingKeysRecursive($Template, $Existing) {
  # If there's no existing config at this node, take template wholesale
  if ($null -eq $Existing) { return $Template }

  # If both are objects, recursively add missing properties
  if ((Is-PlainObject $Template) -and (Is-PlainObject $Existing)) {
    foreach ($p in $Template.PSObject.Properties) {
      $name = $p.Name
      $tVal = $p.Value

      $eProp = $Existing.PSObject.Properties[$name]
      if ($null -eq $eProp) {
        # missing key -> add from template
        Add-Member -InputObject $Existing -MemberType NoteProperty -Name $name -Value $tVal
      } else {
        # present -> recurse if both are objects
        $eVal = $eProp.Value
        $newVal = Add-MissingKeysRecursive $tVal $eVal
        $Existing.$name = $newVal
      }
    }
    return $Existing
  }

  # Otherwise (arrays/scalars), do not override existing values
  return $Existing
}

$templatePath = Join-Path $dest "config.example.json"
$configPath   = Join-Path $dest "config.json"

$template = ConvertFrom-JsonFile $templatePath
if ($null -eq $template) {
  Write-Warning "No config.example.json found/readable in destination; skipping config merge."
} else {
  $existing = ConvertFrom-JsonFile $configPath

  if ($null -eq $existing) {
    # No config exists -> create from template
    ($template | ConvertTo-Json -Depth 100) | Set-Content -LiteralPath $configPath -Encoding UTF8
    Write-Host "Created config.json from template."
  } else {
    $merged = Add-MissingKeysRecursive $template $existing
    ($merged | ConvertTo-Json -Depth 100) | Set-Content -LiteralPath $configPath -Encoding UTF8
    Write-Host "Updated config.json (added missing keys only; preserved existing values)."
  }
}

Write-Host "Done."
Write-Host "Next:"
Write-Host "  cd `"$dest`""
Write-Host "  npm ci"
Write-Host "  npm start"