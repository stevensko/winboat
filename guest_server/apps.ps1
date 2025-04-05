# Load System.Drawing for icon extraction
Add-Type -AssemblyName System.Drawing

# Function to extract icon as base64
function Get-ApplicationIcon {
    param ([string]$exePath)
    try {
        $icon = [System.Drawing.Icon]::ExtractAssociatedIcon($exePath)
        $bmp = New-Object System.Drawing.Bitmap $icon.Width, $icon.Height
        $graphics = [System.Drawing.Graphics]::FromImage($bmp)
        $graphics.DrawIcon($icon, 0, 0)
        $stream = New-Object System.IO.MemoryStream
        $bmp.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
        $base64 = [Convert]::ToBase64String($stream.ToArray())
        $stream.Dispose()
        $graphics.Dispose()
        $bmp.Dispose()
        $icon.Dispose()
        return $base64
    } catch {
        # Fallback 32x32 PNG
        return "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAASZQTFRFAAAA+vr65ubm4uLkhYmLvL7A7u7w+/r729vb4eHjFYPbFoTa5eXnGIbcG4jc+fn7Gofc7+/x7OzuF4Xb+fn54uLiC37Z5OTmEIHaIIjcEYHbDoDZFIPcJ43fHYjd9fX28PDy3d3fI4rd3d3dHojc19fXttTsJIve2dnZDX/YCn3Y09PTjL/p5+fnh7zo2traJYzfIYjdE4Pb6urrW6Tf9PT1Ioneir7otNPsCX3Zhbvn+Pj5YKfhJYfWMo7a39/gKIzeKo7eMI3ZNJDcXqbg4eHhuNTsB3zYIoncBXvZLIrXIYjbLJDgt7m6ubu+YqjiKYvYvr6+tba3rs/sz8/P1+byJonXv7/DiImLxsbGjo6Ra6reurq6io6QkJKVw8PD0tLSycnJq1DGywAAAGJ0Uk5TAP////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+BVJDaAAABY0lEQVR4nM2RaVOCUBSGr1CBgFZimppgoGnKopZSaYGmRpravq///0904IqOM9j00WeGT+9ztgtCS8Dzyh98fL6i2+HqQoaj0RPSzQNgzZc4F4wgvUuoqkr1er094MjlIeBCwRdFua9CqURQ51cty7Lykj0YCIIibnlEkS4TgCuky3nbTmSFsCKSHuso96N/Ox1aacjrlYQQ3gjNCYV7UlUJ6szCeRZyXmlkNjEZEPSuLIMAuYTreVYROQ8Y8SLTNAhlCdfzLMsaIhfHgEAT7pLtvFTH9QxTNWrmLsaEDu8558y2ZOP5LLNTNUQyiCFnHaRZnjTmzryhnR36FSdnIU9up7RGxAOuKJjOFX2vHvKU5jPiepbvxzR3BIffwROc++AAJy9qjQxQwz9rIjyGeN6tj8VACEyZCqfQn3H7F48vTvwEdlIP+aWvMNkPcl8h8DYeN5vNTqdzCNz5CIv4h7AE/AKcwUFbShJywQAAAABJRU5ErkJggg=="
    }
}

# Function to get app name from exe
function Get-ApplicationName {
    param ([string]$exePath)
    try {
        return ((Get-Item $exePath).VersionInfo.FileDescription.Trim() -replace '\s+', ' ')
    } catch {
        return [System.IO.Path]::GetFileNameWithoutExtension($exePath)
    }
}

# Function to get UWP app name
function Get-UWPApplicationName {
    param ([string]$exePath, $app)
    if (Test-Path $exePath) {
        $name = Get-ApplicationName -exePath $exePath
        if ($name) { return $name }
    }
    if ($app.DisplayName) { return $app.DisplayName }
    if ($app.Name) { return $app.Name }
    return $null
}

# Function to get UWP exe path from manifest
function Get-UWPExecutablePath {
    param ([string]$instLoc)
    $manifestPath = Join-Path -Path $instLoc -ChildPath "AppxManifest.xml"
    if (Test-Path $manifestPath) {
        [xml]$manifest = Get-Content $manifestPath
        foreach ($app in $manifest.Package.Applications.Application) {
            if ($app.Executable) {
                return Join-Path -Path $instLoc -ChildPath $app.Executable
            }
        }
    }
    return $null
}

# Collect all apps
$apps = @()

# Windows Registry
$regPaths = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\*" | 
    ForEach-Object { $_."(default)" } | Where-Object { $_ } | Sort-Object -Unique | ForEach-Object { $_ -replace '^"*|"*$' }
foreach ($path in $regPaths) {
    if (Test-Path $path) {
        $apps += [PSCustomObject]@{
            Name = Get-ApplicationName -exePath $path
            Path = $path
            Icon = Get-ApplicationIcon -exePath $path
            Source = "winreg"
        }
    }
}

# UWP Apps
if (Get-Command Get-AppxPackage -ErrorAction SilentlyContinue) {
    $uwpApps = Get-AppxPackage | Where-Object { $_.IsFramework -eq $false -and $_.IsResourcePackage -eq $false -and $_.SignatureKind -ne 'System' }
    foreach ($app in $uwpApps) {
        $exePath = Get-UWPExecutablePath -instLoc $app.InstallLocation
        if ($exePath) {
            $name = Get-UWPApplicationName -exePath $exePath -app $app
            if ($name -and $name -ne "Microsoft® Windows® Operating System") {
                $apps += [PSCustomObject]@{
                    Name = "$name [UWP]"
                    Path = $exePath
                    Icon = Get-ApplicationIcon -exePath $exePath
                    Source = "uwp"
                }
            }
        }
    }
}

# Chocolatey
$chocoDir = "C:\ProgramData\chocolatey\bin"
if (Test-Path $chocoDir) {
    $shimExes = Get-ChildItem -Path $chocoDir -Filter *.exe
    foreach ($shim in $shimExes) {
        $exePath = (Get-Command $shim).Source
        if ($exePath) {
            $name = Get-ApplicationName -exePath $exePath
            if ($name.EndsWith(" - Chocolatey Shim")) { $name = $name.Substring(0, $name.Length - " - Chocolatey Shim".Length) }
            $apps += [PSCustomObject]@{
                Name = "$name [CHOCO]"
                Path = $exePath
                Icon = Get-ApplicationIcon -exePath $exePath
                Source = "choco"
            }
        }
    }
}

# Scoop
$scoopDir = "$HOME\scoop\shims"
if (Test-Path $scoopDir) {
    $shimFiles = Get-ChildItem -Path $scoopDir -Filter *.shim
    foreach ($shim in $shimFiles) {
        $content = Get-Content $shim.FullName
        $exePath = $content | Where-Object { $_ -match '^\s*path\s*=\s*"([^"]+)"' } | ForEach-Object { $matches[1] }
        if ($exePath) {
            $apps += [PSCustomObject]@{
                Name = "$(Get-ApplicationName -exePath $exePath) [SCOOP]"
                Path = $exePath
                Icon = Get-ApplicationIcon -exePath $exePath
                Source = "scoop"
            }
        }
    }
}

# Output as JSON
$apps | ConvertTo-Json -Compress