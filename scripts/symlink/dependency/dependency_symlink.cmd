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

SET CURRENTDIR=%cd%
SET ARGS=%~n0 %*
SET PTH=%CURRENTDIR%\symlink.config.json

:: returns absolute path to out directory: E:\marckassay\AIT\out\out-scripts
FOR /F "USEBACKQ tokens=2 delims=:," %%G IN (`findstr /r /c:".*projectOutPath.*:.*" %PTH%`) DO (
  SET OUTPATH=%%G
  SET OUTPATH=!OUTPATH:"=!
  SET OUTPATH=!OUTPATH:/=\!
  SET OUTPATH=!OUTPATH: =!
)

SET EXP=".*name.*:.*%~n0%.*"

:FindAdaptorLine 1
IF EXIST %ERRORLEVEL% == 1 (
:FindAdaptorLine 2
)

IF EXIST %ERRORLEVEL% == 1 (
SET ADAPTORPATH=adaptor.js
)

ECHO Executing: node %CURRENTDIR%\%OUTPATH%\%ADAPTORPATH% %ARGS%
node %CURRENTDIR%\%OUTPATH%\%ADAPTORPATH% %ARGS%

:FindAdaptorLine
  FOR /F "USEBACKQ tokens=1 delims=:," %%H IN (`findstr /n /r /c:%EXP% %PTH%`) DO ( SET COMMANDLINENUM=%%H+%%~1)
  FOR /F "tokens=1,* delims=:" %%A IN ('findstr /n "^" %PTH% ^| findstr /l /b /c:"%COMMANDLINENUM%:"') DO ( SET ADAPTORPATH=%%B )
  FOR /F "tokens=1,* delims=:" %%C IN ('ECHO %ADAPTORPATH% ^| findstr /r /c:".*adaptor.*:.*"') DO (
    SET ADAPTORPATH=%%D
    SET ADAPTORPATH=!ADAPTORPATH:"=!
    SET ADAPTORPATH=!ADAPTORPATH:/=\!
    SET ADAPTORPATH=!ADAPTORPATH: =!
  )
  IF EXIST "%CURRENTDIR%\%OUTPATH%\%ADAPTORPATH%" (
    EXIT /B 0
  ) ELSE (
    EXIT /B 1
  )

ENDLOCAL
@ECHO ON
