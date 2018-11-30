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

:: SET THIS BY GENERATOR
SET $Outpath={Outpath}

:: SET THIS BY GENERATOR
SET $AdaptorPath={AdaptorPath}

:: ECHO [%~n0.cmd] Executing: node %$CurrentDir%\%$Outpath%\%$AdaptorPath% %$Args%
node %$CurrentDir%\%$Outpath%\%$AdaptorPath% %$Args%

ENDLOCAL
@ECHO ON
