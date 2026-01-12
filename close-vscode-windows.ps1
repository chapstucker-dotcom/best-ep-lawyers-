<#
close-vscode-windows.ps1

Find VS Code windows whose title contains any of the patterns below and send a graceful close (WM_CLOSE).
If a native save dialog appears, the script brings the window forward and sends Esc (usually maps to Cancel).

Usage (PowerShell):
  Right-click -> Run with PowerShell
  or
  powershell -ExecutionPolicy Bypass -File "C:\Users\PC\Projects\best-ep-lawyers-\close-vscode-windows.ps1"

Notes / limitations:
- This targets top-level VS Code windows by their process MainWindowTitle. It will only close windows whose title contains one of the exact strings (case-insensitive):
  "vite.config.ts", "index.html", "EP BEST LAWYERS"
- Some VS Code save prompts are rendered inside the window (not a native dialog). Those may not be dismissable via a native BM_CLICK; sending Esc often cancels common prompts, but it may not work for every UI variant.
- The script asks for confirmation before acting.
#>

[CmdletBinding()]
param()

# Patterns to match (case-insensitive)
$patterns = @('vite.config.ts','index.html','EP BEST LAWYERS')

Write-Host "This will look for VS Code windows with titles containing:`n  $($patterns -join ", ")`n"
$ok = Read-Host "Proceed and attempt to close matching windows? (Y/N)"
if ($ok -notin @('Y','y')) {
    Write-Host "Aborted by user."; exit 0
}

Add-Type @"
using System;
using System.Runtime.InteropServices;
public static class Win32 {
    [DllImport("user32.dll")]
    public static extern bool PostMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern bool SetForegroundWindow(IntPtr hWnd);
}
"@

# Load SendKeys from WinForms
Add-Type -AssemblyName System.Windows.Forms

$closedAny = $false
$procs = Get-Process -Name 'Code' -ErrorAction SilentlyContinue
if (-not $procs) {
    Write-Host "No running 'Code' (VS Code) processes found."; exit 0
}

foreach ($p in $procs) {
    try {
        $title = $p.MainWindowTitle
        if ([string]::IsNullOrWhiteSpace($title)) { continue }
        foreach ($pat in $patterns) {
            if ($title.IndexOf($pat, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) {
                $hwnd = [IntPtr]$p.MainWindowHandle
                if ($hwnd -eq [IntPtr]::Zero) { continue }
                Write-Host "Found matching VS Code window (PID $($p.Id)): '$title' - sending WM_CLOSE..."
                # WM_CLOSE = 0x0010
                [Win32]::PostMessage($hwnd, 0x0010, [IntPtr]::Zero, [IntPtr]::Zero) | Out-Null
                Start-Sleep -Milliseconds 300
                # Attempt to bring window forward and send Esc (commonly cancels save prompts)
                [Win32]::SetForegroundWindow($hwnd) | Out-Null
                [System.Windows.Forms.SendKeys]::SendWait("{ESC}")
                Start-Sleep -Milliseconds 200
                $closedAny = $true
                break
            }
        }
    } catch {
        Write-Warning "Error inspecting process $($p.Id): $_"
    }
}

if ($closedAny) { Write-Host "Done — attempted to close matching windows and sent Esc to dismiss possible save dialogs." }
else { Write-Host "No VS Code windows matched the requested titles." }

# End
