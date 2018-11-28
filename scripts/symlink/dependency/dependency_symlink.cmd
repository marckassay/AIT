:: objective:
:: retrieve where this symlink is being executed. If being loaded from a project with a
:: symlink.config.json file, load the 'projectOutPath' var and if available, 'adaptor' var. And
:: then executed the (generic or not) adaptor file with node.js. This requires:
:: 1.) loading: %$CurrentDir%\symlink.config.json
:: 2.) parse file from step 1 for 'projectOutPath' var.
:: 3.) parse file from step 1 for custom adaptor (if avail) 'adaptor'. using the '%~n0%' will return
::     the filename that maps to the dependencies name of the config file from step 1.
:: 4.) with the following gathered data, executed with node, in the causal expression:
::     'node %$CurrentDir%\projectOutPath\adaptor.js %~0%'
::
::     node  "%~dp0\..\which\bin\which" %*
:: (possible secondary attempt)if that fails, then load the
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
