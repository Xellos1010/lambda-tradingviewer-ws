@echo off
setlocal enabledelayedexpansion

set CALLINGDIRECTORY_CREATE_POLICIES=%CD%

set SCRIPT_DIR_CREATE_POLICIES=%~dp0
set SCRIPT_DIR_CREATE_POLICIES=%SCRIPT_DIR_CREATE_POLICIES:~0,-1%


rem Define the folder path
if not defined POLICIES_FOLDER set "POLICIES_FOLDER=.\policies"
if not defined STAGE set STAGE=dev
if not defined ENV set ENV=DEV
if not defined AWS_PROFILE set AWS_PROFILE=SystemDeveloper-Xellos

if not defined LOG_FILE (
    set LOG_FILE=debug-create-policies-%ENV%.log
    rem Delete the log file if it exists
    if exist "%LOG_FILE%" del "%LOG_FILE%"
)

if not "%CD%"=="%SCRIPT_DIR_CREATE_POLICIES%" (
    echo Changing directory to the script location
    echo Changing directory to the script location >> %LOG_FILE%
    cd %SCRIPT_DIR_CREATE_POLICIES%
) else (
    echo Already in the script location
    echo Already in the script location >> %LOG_FILE%
)

rem Create and Attach Additional Policies
echo. Creating Policies...
echo. Creating Policies... >> %LOG_FILE%

rem Iterate through each .json file in the policies folder
for %%f in ("%POLICIES_FOLDER%\*.json") do (
    
    rem Extract policy name from filename
    set "FILENAME=%%~nf"
    echo Filename Found !FILENAME! extracting the policy name
    
    rem Attach the policy to the role
    echo Creating policy !FILENAME!
    echo Creating policy !FILENAME! >> %LOG_FILE%
    
    rem Attach the policy to the role and capture the output as JSON
    aws iam create-policy --policy-name !FILENAME! --policy-document file://!POLICIES_FOLDER!\!FILENAME!.json --profile %AWS_PROFILE% > temp_output.txt 2>&1
    type temp_output.txt >> %LOG_FILE%

    rem Check the exit code of the aws command
    if %errorlevel% equ 0 (
        echo Create success: !FILENAME!
        echo Create success: !FILENAME! >> %LOG_FILE%
    ) else (
        echo Create failed: !FILENAME!
        echo Create failed: !FILENAME! >> %LOG_FILE%
    )

    rem Clean up the temporary output file
    del temp_output.txt
)

echo. Policies Created.
echo. Policies Created. >> %LOG_FILE%

:end
echo Script execution completed.
echo Script execution completed. >> %LOG_FILE%
if not "%CD%"=="%CALLINGDIRECTORY_CREATE_POLICIES%" (
    echo Changing back to the original directory
    echo Changing back to the original directory >> %LOG_FILE%
    cd %CALLINGDIRECTORY_CREATE_POLICIES%
)
rem End of script