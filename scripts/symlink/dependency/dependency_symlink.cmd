@ECHO OFF
@SETLOCAL
@SET PATHEXT=%PATHEXT:;.JS;=;%

SET adaptor=adaptor.js
SET pathex=%cd%\%adaptor%
echo "%pathex% " %*
echo "%~dp0%adaptor%" %*
@ECHO ON
