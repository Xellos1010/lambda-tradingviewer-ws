@echo off

set CALLINGDIRECTORY_ATTACH_POLICIES=%CD%
set SCRIPT_DIR_ATTACH_POLICIES=%~dp0
set SCRIPT_DIR_ATTACH_POLICIES=%SCRIPT_DIR_ATTACH_POLICIES:~0,-1%

rem Define the folder path
if not defined POLICIES_FOLDER set "POLICIES_FOLDER=.\policies"

rem Define role name and account ID
if not defined STAGE set STAGE=dev
if not defined ENV set ENV=DEV
if not defined FUNCTION set FUNCTION=TV-Lambda-Bot
if not defined FUNCTION_NAME set FUNCTION_NAME=%FUNCTION%-%ENV%
if not defined ROLE_NAME set ROLE_NAME=%FUNCTION%LambdaExecutionRole-%ENV%
if not defined ACCOUNT_ID set ACCOUNT_ID=697426589657
if not defined AWS_PROFILE set AWS_PROFILE=SystemDeveloper-Xellos

if not defined LOG_FILE (
    set LOG_FILE=debug-attach-policies-%ENV%.log
    rem Delete the log file if it exists
    if exist "%LOG_FILE%" del "%LOG_FILE%"
)

if not "%CD%"=="%SCRIPT_DIR_ATTACH_POLICIES%" (
    echo Changing directory to the script location
    echo Changing directory to the script location >> %LOG_FILE%
    cd %SCRIPT_DIR_ATTACH_POLICIES%
) else (
    echo Already in the script location
    echo Already in the script location >> %LOG_FILE%
)


echo. Attaching Policies...
echo. Attaching Policies... >> %LOG_FILE%

aws iam attach-role-policy --role-name %ROLE_NAME% --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole --profile %AWS_PROFILE% >> %LOG_FILE% 2>&1

rem Iterate through each .json file in the policies folder
for %%f in ("%POLICIES_FOLDER%\*.json") do (
    rem Extract policy name from filename
    set "FILENAME=%%~nf"
    echo Filename Found !FILENAME! extracting the policy name
    rem Attach the policy to the role
    echo Attaching policy !FILENAME! to role %ROLE_NAME%
    echo Attaching policy !FILENAME! to role %ROLE_NAME% >> %LOG_FILE%
    rem Attach the policy to the role and capture the output as JSON
    aws iam attach-role-policy --role-name %ROLE_NAME% --policy-arn arn:aws:iam::%ACCOUNT_ID%:policy/!FILENAME! --profile %AWS_PROFILE% > temp_output.txt 2>&1

    rem Check the exit code of the aws command
    if %errorlevel% equ 0 (
        echo Attachment success: !FILENAME!
        echo Attachment success: !FILENAME! >> %LOG_FILE%
    ) else (
        echo Attachment failed: !FILENAME!
        echo Attachment failed: !FILENAME! >> %LOG_FILE%
    )

    rem Clean up the temporary output file
    del temp_output.txt
)

echo. Execution Role and Policies Created and assigned.
echo. Execution Role and Policies Created and assigned. >> %LOG_FILE%

:end
echo Script execution completed.
echo Script execution completed. >> %LOG_FILE%
if not "%CD%"=="%CALLINGDIRECTORY_ATTACH_POLICIES%" (
    echo Changing back to the original directory
    echo Changing back to the original directory >> %LOG_FILE%
    cd %CALLINGDIRECTORY_ATTACH_POLICIES%
)
rem End of script
