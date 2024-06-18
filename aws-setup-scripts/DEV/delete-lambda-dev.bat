@echo off
setlocal enabledelayedexpansion

rem Set your AWS profile
if not defined STAGE set STAGE=dev
if not defined ENV set ENV=DEV
if not defined AWS_PROFILE set AWS_PROFILE=SystemDeveloper
if not defined FUNCTION set FUNCTION=TV-Lambda-Bot
set FUNCTION_NAME=%FUNCTION%-%ENV%
if not defined FUNCTION_NAME set FUNCTION_NAME=%FUNCTION%-%ENV%
if not defined ROLE_NAME set ROLE_NAME=%FUNCTION%LambdaExecutionRole-%ENV%
if not defined POLICIES_FOLDER set "POLICIES_FOLDER=.\policies"
if not defined LOG_FILE (
    set LOG_FILE=debug-delete-lambda-%ENV%.log
    rem Delete the log file if it exists
    if exist "%LOG_FILE%" del "%LOG_FILE%"
)
set CALLINGDIRECTORY_DELETE_POLICIES=%CD%
set SCRIPT_DIR_DELETE_POLICIES=%~dp0
set SCRIPT_DIR_DELETE_POLICIES=%SCRIPT_DIR_DELETE_POLICIES:~0,-1%

if not "%CD%"=="%SCRIPT_DIR_DELETE_POLICIES%" (
    echo Changing directory to the script location
    echo Changing directory to the script location >> %LOG_FILE%
    cd %SCRIPT_DIR_DELETE_POLICIES%
) else (
    echo Already in the script location
    echo Already in the script location >> %LOG_FILE%
)

rem Delete the Lambda function
echo Deleting Lambda function...
aws lambda delete-function --function-name %FUNCTION_NAME% --profile %AWS_PROFILE%

rem Detach policies from the IAM role
echo Detaching policies from the IAM role...

rem Iterate through each .json file in the policies folder
aws iam detach-role-policy --role-name %ROLE_NAME% --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole --profile %AWS_PROFILE%
rem Check the exit code of the aws command
    if %errorlevel% equ 0 (
        echo Detaching success: AWSLambdaBasicExecutionRole
        echo Detaching success: AWSLambdaBasicExecutionRole >> %LOG_FILE%
    ) else (
        echo Detaching failed: AWSLambdaBasicExecutionRole
        echo Detaching failed: AWSLambdaBasicExecutionRole >> %LOG_FILE%
    )

for %%f in ("%POLICIES_FOLDER%\*.json") do (
    rem Extract policy name from filename
    set "FILENAME=%%~nf"
    echo Filename Found !FILENAME! extracting the policy name
    rem Attach the policy to the role
    echo Detaching policy !FILENAME! to role %ROLE_NAME%
    echo Detaching policy !FILENAME! to role %ROLE_NAME% >> %LOG_FILE%
    rem Attach the policy to the role and capture the output as JSON
    aws iam detach-role-policy --role-name %ROLE_NAME% --policy-arn arn:aws:iam::%ACCOUNT_ID%:policy/!FILENAME! --profile %AWS_PROFILE% > temp_output.txt 2>&1

    rem Check the exit code of the aws command
    if %errorlevel% equ 0 (
        echo Detaching success: !FILENAME!
        echo Detaching success: !FILENAME! >> %LOG_FILE%
    ) else (
        echo Detaching failed: !FILENAME!
        echo Detaching failed: !FILENAME! >> %LOG_FILE%
    )

    rem Clean up the temporary output file
    del temp_output.txt
)

rem Delete the IAM role
echo Deleting IAM role...
aws iam delete-role --role-name %ROLE_NAME% --profile %AWS_PROFILE%

:end
echo Script execution completed.
echo Script execution completed. >> %LOG_FILE%
if not "%CD%"=="%CALLINGDIRECTORY_DELETE_POLICIES%" (
    echo Changing back to the original directory
    echo Changing back to the original directory >> %LOG_FILE%
    cd %CALLINGDIRECTORY_DELETE_POLICIES%
)
rem End of script
