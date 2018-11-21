@ECHO OFF
@SETLOCAL

SETLOCAL enableDelayedExpansion

:: skip the first 7 lines of `fsutil reparsepoint query %0`. Even columns 2-16 contains the
:: hexadecimal chars we want versus '00'.
FOR /F "USEBACKQ tokens=2,4,6,8,10,12,14,16 skip=7" %%G IN (`fsutil reparsepoint query %0`) DO (
  SETLOCAL enableDelayedExpansion
  SET MYVAR=%%G%%H%%I%%J%%K%%L%%M%%N
  SET _result=!_result!!MYVAR!
)

:: trim  the first 12 chars which seems to be attributes that pertains to this file. These are not
:: needed for this script's objective
SET _result=!_result:~12!

:: replace on '5c3f3f' (\??) to 'Z' so that the FOR /F can use delims=Z. FOR loop's delims option
:: is limited to 1 char and the char 'Z' isn't valid for a hexadecimal value, so here its used as
:: conveniently as a token.
SET _result=!_result:5c3f3f=Z!

:: split _result on the 'Z' token and assign the left side to _result
FOR /F "delims=Z" %%a IN ("%_result%") DO (SET _result=%%a)
ECHO Hexadecimals of resolved symlink value:
ECHO   !_result!

:: ref: https://stackoverflow.com/questions/15004825/looping-for-every-character-in-variable-string-batch
:: string terminator: chose something that won't show up in the input file
SET strterm=___ENDOFSTRING___
:: add string terminator to input
SET tmp=%_result%%strterm%

:loop
  :: get first 2 characters from input
  SET char=%tmp:~0,2%
  :: remove first 2 characters from input
  SET tmp=%tmp:~2%
  :: Format char to Hexadecimal
  SET /a hexadecimalchar=0x%char%
  :: exit should set 'exitcodeAscii' dynamic var
  CMD /c exit %hexadecimalchar%
  :: append value of 'exitcodeAscii' to _result
  SET _convertedresult=!_convertedresult!!=exitcodeAscii!

IF NOT "%tmp%" == "%strterm%" GOTO loop

ECHO Convert Hexadecimals to chars:
ECHO   !_convertedresult!

ENDLOCAL
@ECHO ON
