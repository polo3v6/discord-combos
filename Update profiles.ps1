$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$profilesRoot = Join-Path $root "assets\profiles"
$orderPath = Join-Path $root "profiles-order.json"
$extensions = @(".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg")
$profiles = @()
$folders = @(Get-ChildItem -LiteralPath $profilesRoot -Directory -ErrorAction SilentlyContinue)
$previousNames = @()
if (Test-Path -LiteralPath $orderPath) {
    $rawOrder = Get-Content -LiteralPath $orderPath -Raw
    $previousNames = @([regex]::Matches($rawOrder, '"(?:\\.|[^"\\])*"') | ForEach-Object { ConvertFrom-Json $_.Value })
}
$orderIndex = @{}
for ($i = 0; $i -lt $previousNames.Count; $i++) { $orderIndex[$previousNames[$i]] = $i }
$orderedFolders = @($folders | Sort-Object `
    @{ Expression = { if ($orderIndex.ContainsKey($_.Name)) { $orderIndex[$_.Name] } else { -1 } } }, `
    @{ Expression = { $_.LastWriteTime }; Descending = $true })

if (Test-Path -LiteralPath $profilesRoot) {
    foreach ($folder in $orderedFolders) {
        $images = Get-ChildItem -LiteralPath $folder.FullName -File | Where-Object { $extensions -contains $_.Extension.ToLowerInvariant() }
        $pfp = $images | Where-Object { $_.BaseName -ieq "pfp" } | Select-Object -First 1
        $banner = $images | Where-Object { $_.BaseName -ieq "banner" } | Select-Object -First 1
        $folderName = [uri]::EscapeDataString($folder.Name)
        $pfpPath = if ($pfp) { "assets/profiles/$folderName/$([uri]::EscapeDataString($pfp.Name))" } else { "assets/blank.svg" }
        $bannerPath = if ($banner) { "assets/profiles/$folderName/$([uri]::EscapeDataString($banner.Name))" } else { "assets/blank.svg" }
        $profiles += [pscustomobject]@{
            name = $folder.Name
            pfp = $pfpPath
            banner = $bannerPath
        }
    }
}

$json = ConvertTo-Json -InputObject @($profiles) -Depth 4
Set-Content -LiteralPath (Join-Path $root "profiles-data.js") -Value "window.PROFILES = $json;" -Encoding utf8
$orderedNames = @($orderedFolders | ForEach-Object { $_.Name })
ConvertTo-Json -InputObject $orderedNames | Set-Content -LiteralPath $orderPath -Encoding utf8
Write-Host "Updated the gallery with $($profiles.Count) profile(s)."

