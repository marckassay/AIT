@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\cordova\bin\cordova" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  rem node  "%~dp0\..\cordova\bin\cordova" %*
  pwsh.exe -File "%~dp0%\npm-iex.ps1" %*
)
