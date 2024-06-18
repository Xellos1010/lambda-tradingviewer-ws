@echo off
if not defined AWS_PROFILE set AWS_PROFILE=SystemDeveloper-Xellos

rem Set a log file for debugging
set LOG_FILE=%CD%\debug-update-DEV.log
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
set HANDLER=index.handler
set ZIP_FILE=lambda_function-%ENV%.zip

rem Update the API Gateway Integration (assuming the api_id is already known and set)


rem Check if %ZIP_FILE% exists and delete it if it does
if exist %ZIP_FILE% (
    echo Deleting existing ZIP file: %ZIP_FILE%
    echo Deleting existing ZIP file: %ZIP_FILE% >> %LOG_FILE% 2>&1
    del %ZIP_FILE% >> %LOG_FILE% 2>&1
)

rem Compress files using 7z
echo Compressing project files into ZIP...
echo Compressing project files into ZIP... >> %LOG_FILE% 2>&1
7z a %ZIP_FILE% index.js package.json node_modules\* utilities\* >> %LOG_FILE% 2>&1
echo Compression complete.

rem Execute AWS CLI command to update Lambda function code
echo Deploying Lambda function with AWS CLI...
echo Deploying Lambda function with AWS CLI... >> %LOG_FILE% 2>&1
aws lambda update-function-code --function-name %FUNCTION_NAME% --zip-file fileb://%ZIP_FILE% --profile %AWS_PROFILE%  >> %LOG_FILE% 2>&1

echo "Lambda function code updated."
echo "Lambda function code updated." >> %LOG_FILE% 2>&1
pause
