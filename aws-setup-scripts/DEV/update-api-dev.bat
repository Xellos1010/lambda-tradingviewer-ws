@echo off
setlocal enabledelayedexpansion

rem Define Lambda function information
if not defined STAGE set STAGE=dev
if not defined ENV set ENV=DEV
if not defined FUNCTION set FUNCTION=TV-Lambda-Bot
if not defined FUNCTION_NAME set FUNCTION_NAME=%FUNCTION%-%ENV%
if not defined STATEMENT_ID set STATEMENT_ID=ApiGateway-%FUNCTION_NAME%-%ENV%-Invoke
if not defined REST_API_ID set REST_API_ID=xy52jc9g9b
if not defined RESOURCE_ID set RESOURCE_ID=e0yyuo
if not defined HTTP_METHOD set HTTP_METHOD=POST
if not defined ENDPOINT_NAME set ENDPOINT_NAME=webhook
if not defined ACCOUNT_ID set ACCOUNT_ID=697426589657
if not defined AWS_PROFILE set AWS_PROFILE=SystemDeveloper-Xellos

set CALLINGDIRECTORY_UPDATE_API=%CD%
set SCRIPT_DIR_UPDATE_API=%~dp0
set SCRIPT_DIR_UPDATE_API=%SCRIPT_DIR_UPDATE_API:~0,-1%
if not defined STAGE set STAGE=dev
if not defined ENV set ENV=DEV

if not defined LOG_FILE (
    set LOG_FILE=debug-update-api-%ENV%.log
    rem Delete the log file if it exists
    if exist "%LOG_FILE%" del "%LOG_FILE%"
)

if not "%CD%"=="%SCRIPT_DIR_UPDATE_API%" (
    echo Changing directory to the script location
    echo Changing directory to the script location >> %LOG_FILE%
    cd %SCRIPT_DIR_UPDATE_API%
) else (
    echo Already in the script location
    echo Already in the script location >> %LOG_FILE%
)

rem Find the last occurrence of a backslash to get the parent directory
for %%I in ("%SCRIPT_DIR_UPDATE_API%") do (
    set "SCRIPT_DIR_PARENT_DIR=%%~dpI"
)

@REM Add Test Invocation permissions
aws lambda add-permission --function-name arn:aws:lambda:us-east-1:%ACCOUNT_ID%:function:%FUNCTION_NAME% --statement-id %STATEMENT_ID% --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn arn:aws:execute-api:us-east-1:%ACCOUNT_ID%:%REST_API_ID%/*/POST/%ENDPOINT_NAME% --profile %AWS_PROFILE%

set "BASE_SCRIPT_FILE_PATH=%SCRIPT_DIR_PARENT_DIR%update-api-base.bat"
echo Base script filepath: %BASE_SCRIPT_FILE_PATH%
echo Base script filepath: %BASE_SCRIPT_FILE_PATH% >> %LOG_FILE% 2>&1

echo Executing Base Operation
echo Executing Base Operation >> %LOG_FILE% 2>&1
call %BASE_SCRIPT_FILE_PATH%

:end
echo Lambda Config Environment Updated.
echo Lambda Config Environment Updated. >> %LOG_FILE%
if not "%CD%"=="%CALLINGDIRECTORY_UPDATE_API%" (
    echo Changing back to the original directory >> %LOG_FILE%
    cd %CALLINGDIRECTORY_UPDATE_API%
)
rem End of script