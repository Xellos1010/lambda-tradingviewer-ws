@echo off
setlocal enabledelayedexpansion

set CALLINGDIRECTORY_CREATE_ROLE=%CD%
set SCRIPT_DIR_CREATE_ROLE=%~dp0
set SCRIPT_DIR_CREATE_ROLE=%SCRIPT_DIR_CREATE_ROLE:~0,-1%

if not defined STAGE set STAGE=dev
if not defined ENV set ENV=DEV
if not defined FUNCTION set FUNCTION=AskDaoVersionCheck
if not defined FUNCTION_NAME set FUNCTION_NAME=%FUNCTION%-%ENV%
if not defined ROLE_NAME set ROLE_NAME=%FUNCTION%LambdaExecutionRole-%ENV%

if not defined LOG_FILE (
    set LOG_FILE=debug-create-role-%ENV%.log
    rem Delete the log file if it exists
    if exist "%LOG_FILE%" del "%LOG_FILE%"
)
if not "%CD%"=="%SCRIPT_DIR_CREATE_ROLE%" (
    echo Changing directory to the script location
    echo Changing directory to the script location >> %LOG_FILE%
    cd %SCRIPT_DIR_CREATE_ROLE%
) else (
    echo Already in the script location
    echo Already in the script location >> %LOG_FILE%
)


if not "%CD%"=="%SCRIPT_DIR_CREATE_ROLE%" (
    echo Changing directory to the script location
    echo Changing directory to the script location >> %LOG_FILE%
    cd %SCRIPT_DIR_CREATE_ROLE%
) else (
    echo Already in the script location
    echo Already in the script location >> %LOG_FILE%
)

rem Find the last occurrence of a backslash to get the parent directory
for %%I in ("%SCRIPT_DIR_CREATE_ROLE%") do (
    set "SCRIPT_DIR_PARENT_DIR=%%~dpI"
)

set "BASE_SCRIPT_FILE_PATH=%SCRIPT_DIR_PARENT_DIR%create-role-base.bat"
echo Base script filepath: %BASE_SCRIPT_FILE_PATH%
echo Base script filepath: %BASE_SCRIPT_FILE_PATH% >> %LOG_FILE% 2>&1

echo Executing Base Operation
echo Executing Base Operation >> %LOG_FILE% 2>&1
call %BASE_SCRIPT_FILE_PATH%

:end
echo Script execution completed.
echo Script execution completed. >> %LOG_FILE%
if not "%CD%"=="%CALLINGDIRECTORY_CREATE_ROLE%" (
    echo Changing back to the original directory
    echo Changing back to the original directory >> %LOG_FILE%
    cd %CALLINGDIRECTORY_CREATE_ROLE%
)
rem End of script
