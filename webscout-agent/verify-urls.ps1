# URL 수집기 산출물 검증 스크립트
# 사용법: .\verify-urls.ps1 -TargetDomain "https://example.com"
# 또는: .\verify-urls.ps1 (기본값 https://example.com)

param(
    [string]$TargetDomain = "https://example.com"
)

$ErrorActionPreference = "Continue"
$txtPath = "urls.txt"

if (-not (Test-Path $txtPath)) {
    Write-Host "ERROR: urls.txt not found. Run collect-urls.mjs first." -ForegroundColor Red
    exit 1
}

$baseUrl = [System.Uri]$TargetDomain
$hostNorm = $baseUrl.Host.ToLower()
$canonicalHost = if ($hostNorm.StartsWith("www.")) { $hostNorm.Substring(4) } else { $hostNorm }

Write-Host "`n=== 1) wc -l urls.txt ===" -ForegroundColor Cyan
$lineCount = (Get-Content $txtPath | Measure-Object -Line).Lines
Write-Host "Lines: $lineCount"

Write-Host "`n=== 2) head -n 10 urls.txt ===" -ForegroundColor Cyan
Get-Content $txtPath -TotalCount 10

Write-Host "`n=== 3) tail -n 10 urls.txt ===" -ForegroundColor Cyan
Get-Content $txtPath -Tail 10

Write-Host "`n=== 4) hash (#) check - should be empty ===" -ForegroundColor Cyan
$hashLines = Get-Content $txtPath | Select-String -Pattern "#" -SimpleMatch
if ($hashLines) { Write-Host "FAIL: hash found"; $hashLines | Select-Object -First 5 } else { Write-Host "OK: no hash" -ForegroundColor Green }

Write-Host "`n=== 5) mailto/tel/javascript check - should be empty ===" -ForegroundColor Cyan
$badScheme = Get-Content $txtPath | Select-String -Pattern "^(mailto:|tel:|javascript:)"
if ($badScheme) { Write-Host "FAIL: bad scheme"; $badScheme | Select-Object -First 5 } else { Write-Host "OK: no mailto/tel/javascript" -ForegroundColor Green }

Write-Host "`n=== 6) other-origin check - host != $canonicalHost ===" -ForegroundColor Cyan
$otherOrigin = Get-Content $txtPath | Where-Object {
    if ([string]::IsNullOrWhiteSpace($_)) { return $false }
    try {
        $u = [System.Uri]$_
        $uh = $u.Host.ToLower()
        $uhCanon = if ($uh.StartsWith("www.")) { $uh.Substring(4) } else { $uh }
        $uhCanon -ne $canonicalHost
    } catch { $true }
}
if ($otherOrigin) { Write-Host "FAIL: other origin mixed in"; $otherOrigin | Select-Object -First 10 } else { Write-Host "OK: all same-origin (incl. www/non-www)" -ForegroundColor Green }

Write-Host "`n=== Summary ===" -ForegroundColor Yellow
Write-Host "Total URLs: $lineCount"
Write-Host "Target domain: $TargetDomain"
