$f = "src\pages\Home\LandingPage.jsx"
$bytes = [System.IO.File]::ReadAllBytes($f)
$c = [System.Text.Encoding]::UTF8.GetString($bytes)

function FixMojibake([string]$text, [byte[]]$badBytes, [string]$good) {
    $badStr = [System.Text.Encoding]::Latin1.GetString($badBytes)
    return $text.Replace($badStr, $good)
}

# â‚¹ (bytes E2 82 B9) -> ₹
$c = FixMojibake $c @(0xE2, 0x82, 0xB9) ([char]0x20B9)

# â€¢ (bytes E2 80 A2) -> •
$c = FixMojibake $c @(0xE2, 0x80, 0xA2) ([char]0x2022)

# â†' (bytes E2 86 92) -> →
$c = FixMojibake $c @(0xE2, 0x86, 0x92) ([char]0x2192)

# âœ" (bytes E2 9C 93) -> ✓
$c = FixMojibake $c @(0xE2, 0x9C, 0x93) ([char]0x2713)

# â˜… (bytes E2 98 85) -> ★
$c = FixMojibake $c @(0xE2, 0x98, 0x85) ([char]0x2605)

# â€" (bytes E2 80 94) -> —
$c = FixMojibake $c @(0xE2, 0x80, 0x94) ([char]0x2014)

# â€" (bytes E2 80 93) -> –
$c = FixMojibake $c @(0xE2, 0x80, 0x93) ([char]0x2013)

# â€™ (bytes E2 80 99) -> '
$c = FixMojibake $c @(0xE2, 0x80, 0x99) ([char]0x2019)

# â€œ (bytes E2 80 9C) -> "
$c = FixMojibake $c @(0xE2, 0x80, 0x9C) ([char]0x201C)

# â€ (bytes E2 80 9D) -> "
$c = FixMojibake $c @(0xE2, 0x80, 0x9D) ([char]0x201D)

# ðŸš€ (bytes F0 9F 9A 80) -> 🚀
$c = FixMojibake $c @(0xF0, 0x9F, 0x9A, 0x80) ([System.Char]::ConvertFromUtf32(0x1F680))

# Â© (bytes C2 A9) -> ©
$c = FixMojibake $c @(0xC2, 0xA9) ([char]0xA9)

$outBytes = [System.Text.Encoding]::UTF8.GetBytes($c)
[System.IO.File]::WriteAllBytes($f, $outBytes)
Write-Host "Done. Fixed mojibake in $f"
