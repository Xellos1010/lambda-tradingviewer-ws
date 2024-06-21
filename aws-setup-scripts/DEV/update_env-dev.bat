@echo off

rem Define Lambda function information
if not defined STAGE set STAGE=dev
if not defined ENV set ENV=DEV
if not defined FUNCTION set FUNCTION=TV-Lambda-Bot
if not defined FUNCTION_NAME set FUNCTION_NAME=%FUNCTION%-%ENV%
if not defined AWS_PROFILE set AWS_PROFILE=SystemDeveloper-Xellos

set CALLINGDIRECTORY_UPDATE_ENV=%CD%
set SCRIPT_DIR_UPDATE_ENV=%~dp0
set SCRIPT_DIR_UPDATE_ENV=%SCRIPT_DIR_UPDATE_ENV:~0,-1%

if not defined LOG_FILE (
    set LOG_FILE=debug-update-env-%ENV%.log
    rem Delete the log file if it exists
    if exist "%LOG_FILE%" del "%LOG_FILE%"
)

if not "%CD%"=="%SCRIPT_DIR_UPDATE_ENV%" (
    echo Changing directory to the script location
    echo Changing directory to the script location >> %LOG_FILE%
    cd %SCRIPT_DIR_UPDATE_ENV%
) else (
    echo Already in the script location
    echo Already in the script location >> %LOG_FILE%
)

aws lambda update-function-configuration --function-name %FUNCTION_NAME% --timeout 20 --profile %AWS_PROFILE%>> %LOG_FILE% 2>&1
aws lambda update-function-configuration --function-name %FUNCTION_NAME% --environment file://lambda-config-%ENV%.json --profile %AWS_PROFILE%>> %LOG_FILE% 2>&1

:end
echo Lambda Config Environment Updated.
echo Lambda Config Environment Updated. >> %LOG_FILE%
if not "%CD%"=="%CALLINGDIRECTORY_UPDATE_ENV%" (
    echo Changing back to the original directory >> %LOG_FILE%
    cd %CALLINGDIRECTORY_UPDATE_ENV%
)
rem End of script
