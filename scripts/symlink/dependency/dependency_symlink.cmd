@ECHO OFF
@SETLOCAL
@SET PATHEXT=%PATHEXT:;.JS;=;%

SET adaptor="adaptor.js"
node "%~dp0%adaptor%" %*
@ECHO ON
