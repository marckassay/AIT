:: objective:
:: retrieve where this symlink is being executed. If being loaded from a project with a
:: symlink.config.json file, load the 'projectOutPath' var and if available, 'adaptor' var. And
:: then executed the (generic or not) adaptor file with node.js. This requires:
:: 1.) loading: %CURRENTDIR%\symlink.config.json
:: 2.) parse file from step 1 for 'projectOutPath' var.
:: 3.) parse file from step 1 for custom adaptor (if avail) 'adaptor'. using the '%~n0%' will return
::     the filename that maps to the dependencies name of the config file from step 1.
:: 4.) with the following gathered data, executed with node, in the causal expression:
::     'node %CURRENTDIR%\projectOutPath\adaptor.js %~0%'
::
::     node  "%~dp0\..\which\bin\which" %*
:: (possible secondary attempt)if that fails, then load the
@ECHO OFF
@SETLOCAL

SETLOCAL enableDelayedExpansion

@SET PATHEXT=%PATHEXT:;.JS;=;%

SET CURRENTDIR="%cd%"

:: returns: E:\marckassay\AIT
ECHO %CURRENTDIR%

:: returns: ionic
ECHO %~n0%

:: returns: ionic.cmd
ECHO %~n0%~x0

:: returns: C:\Program Files\nodejs\bin\ionic.cmd
ECHO %~0%

:: returns: parameters, switches
ECHO %*

:: returns: "C:\Program Files\nodejs\bin\"
ECHO "%~dp0"

@echo off
for /f "tokens=1,2,*" %%a in (' find ":" ^< "%CURRENTDIR%\symlinks.config.json" ') do echo "%%~c"
pause

ENDLOCAL
@ECHO ON
