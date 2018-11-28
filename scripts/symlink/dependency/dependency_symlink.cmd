:: This script file is to be used as a value for a symlink on Windows systems. This symlink is intended
:: to reside in the $ENV:Path so that it can be called in the CLI as a command.
::
:: This script file, along with it's sibling (bash) file for UNIX systems, takes the filename
:: of the symlink, current directory and parses the symlink.config.json file. With the information
:: gathered, it will call the JS adaptor file with node. This adaptor file must reside in the
:: 'projectOutPath' directory which is relative to the current directory.
::
@ECHO OFF
@SETLOCAL
SETLOCAL enableDelayedExpansion

@SET PATHEXT=%PATHEXT:;.JS;=;%

SET $CurrentDir=%cd%
SET $Args=%~n0 %*
SET $JsonConfig=%$CurrentDir%\symlink.config.json

:: returns absolute path to out directory: E:\marckassay\AIT\out\out-scripts
FOR /F "USEBACKQ tokens=2 delims=:," %%G IN (`findstr /r /c:".*projectOutPath.*:.*" %$JsonConfig%`) DO (
  SET $Outpath=%%G
  SET $Outpath=!$Outpath:"=!
  SET $Outpath=!$Outpath:\\=\!
  SET $Outpath=!$Outpath:/=\!
  SET $Outpath=!$Outpath: =!
)

:FindAdaptorLine 1
IF EXIST %ERRORLEVEL% == 1 (
:FindAdaptorLine 2
)

IF EXIST %ERRORLEVEL% == 1 (
SET $AdaptorPath=adaptor.js
)

ECHO [%~n0.cmd] Executing: node %$CurrentDir%\%$Outpath%\%$AdaptorPath% %$Args%
node %$CurrentDir%\%$Outpath%\%$AdaptorPath% %$Args%

:FindAdaptorLine
  FOR /F "USEBACKQ tokens=1 delims=:," %%H IN (`findstr /n /r /c:".*name.*:.*%~n0.*" %$JsonConfig%`) DO ( SET $CommandlineNum=%%H+%%~1)
  FOR /F "USEBACKQ tokens=1,* delims=:" %%A IN (`findstr /n "^" %$JsonConfig% ^| findstr /l /b /c:"%$CommandlineNum%:"`) DO ( SET $AdaptorPath=%%B )
  FOR /F "USEBACKQ tokens=1,* delims=:" %%C IN ('ECHO %$AdaptorPath% ^| findstr /r /c:".*adaptor.*:.*"') DO (
    SET $AdaptorPath=%%D
    SET $AdaptorPath=!$AdaptorPath:"=!
    SET $AdaptorPath=!$AdaptorPath:\\=\!
    SET $AdaptorPath=!$AdaptorPath:/=\!
    SET $AdaptorPath=!$AdaptorPath: =!
  )
  IF EXIST "%$CurrentDir%\%$Outpath%\%$AdaptorPath%" (
    EXIT /B 0
  ) ELSE (
    EXIT /B 1
  )

ENDLOCAL
@ECHO ON
