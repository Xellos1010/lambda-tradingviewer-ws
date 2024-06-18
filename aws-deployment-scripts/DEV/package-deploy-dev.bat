@echo off
setlocal enabledelayedexpansion

rem Set a log file for debugging
set LOG_FILE=%CD%\debug-deploy-DEV.log
echo Setting log file to: %LOG_FILE%
rem Delete the log file if it exists
if exist %LOG_FILE% (
    echo Deleting existing log file: %LOG_FILE%
    del %LOG_FILE%
)

@REM This should be executed from the yarn command otherwise you will not find the directories for zipping

rem Define Lambda function information
set STAGE=dev
set ENV=DEV
set FUNCTION=TV-Lambda-Bot
set FUNCTION_NAME=%FUNCTION%-%ENV%
set ROLE_NAME=%FUNCTION%LambdaExecutionRole-%ENV%
set RUNTIME=nodejs20.x
set ROLE_ARN=arn:aws:iam::697426589657:role/%ROLE_NAME%
set HANDLER=index.handler
set ZIP_FILE=lambda_function-%ENV%.zip
set LOG_GROUP_NAME=/aws/lambda/%FUNCTION_NAME%
set REST_API_ID=xy52jc9g9b
set RESOURCE_ID=e0yyuo
set HTTP_METHOD=POST
set ENDPOINT_NAME=webhook
set ACCOUNT_ID=697426589657
set REGION=us-east-1

rem Get the current directory
set "CURRENT_DIR=%CD%"

@REM echo %CD%

rem Remove trailing backslash if present
if "%CURRENT_DIR:~-1%"=="\" (
    set "CURRENT_DIR=%CURRENT_DIR:~0,-1%"
)

rem Find the last occurrence of a backslash to get the parent directory
for %%I in ("%CURRENT_DIR%") do (
    set "PARENT_DIR=%%~dpI"
)

@REM set "BASE_SCRIPT_FILE_PATH=%PARENT_DIR%package-deploy-base.bat"
set "BASE_SCRIPT_FILE_PATH=%CD%\package-deploy-base.bat"
echo Base script filepath: %BASE_SCRIPT_FILE_PATH%
echo Base script filepath: %BASE_SCRIPT_FILE_PATH% >> %LOG_FILE% 2>&1

echo Executing Base Operation
echo Executing Base Operation >> %LOG_FILE% 2>&1

call %BASE_SCRIPT_FILE_PATH%

:end
echo Script execution completed.
echo Script execution completed. >> %LOG_FILE% 2>&1
rem End of script
