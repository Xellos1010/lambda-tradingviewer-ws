@echo off
setlocal enabledelayedexpansion

set CALLINGDIRECTORY=%CD%
set SCRIPT_DIR=%~dp0
set SCRIPT_DIR=%SCRIPT_DIR:~0,-1%

if not defined STAGE set "STAGE=dev"
if not defined ENV set "ENV=DEV"

echo Setting up the log file...
if not defined LOG_FILE (
    set LOG_FILE=%CALLINGDIRECTORY%\debug-create-endpoint-%ENV%.log
    if exist "%LOG_FILE%" (
        echo Deleting existing log file...
        del "%LOG_FILE%"
    )
)

if not "%CD%"=="%SCRIPT_DIR%" (
    echo Changing directory to the script location
    echo Changing directory to the script location >> %LOG_FILE%
    cd %SCRIPT_DIR%
) else (
    echo Already in the script location
    echo Already in the script location >> %LOG_FILE%
)

REM Call the base endpoint creation script
echo Calling create-endpoint-base.bat
echo Calling create-endpoint-base.bat >> %LOG_FILE%
call ..\create-endpoint-base.bat

:end
echo Script execution completed.
echo Script execution completed. >> %LOG_FILE%
if not "%CD%"=="%CALLINGDIRECTORY%" (
    echo Changing back to the original directory >> %LOG_FILE%
    cd %CALLINGDIRECTORY%
)

endlocal
