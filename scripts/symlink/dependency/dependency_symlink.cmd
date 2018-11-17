@ECHO OFF
@SETLOCAL
@SET PATHEXT=%PATHEXT:;.JS;=;%
SET adaptor=%~n0
SET adaptor="symlink-generic-adaptor.js"
node "%~dp0%adaptor%" %*
@ECHO ON
