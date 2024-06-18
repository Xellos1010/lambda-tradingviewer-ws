@echo off
setlocal enabledelayedexpansion

set CALLINGDIRECTORY_CREATE_NEW_POLICY_VERSIONS=%CD%
set SCRIPT_DIR_CREATE_NEW_POLICY_VERSION=%~dp0
set SCRIPT_DIR_CREATE_NEW_POLICY_VERSION=%SCRIPT_DIR_CREATE_NEW_POLICY_VERSION:~0,-1%

rem Define the folder path
rem Define the folder path
if not defined POLICIES_FOLDER set "POLICIES_FOLDER=.\policies"
if not defined ACCOUNT_ID set ACCOUNT_ID=697426589657
if not defined ENV set ENV=DEV
if not defined AWS_PROFILE set AWS_PROFILE=SystemDeveloper-Xellos

if not defined LOG_FILE (
    set LOG_FILE=%CALLINGDIRECTORY_CREATE_NEW_POLICY_VERSIONS%\debug-delete_old_policy_versions-%ENV%.log
    rem Delete the log file if it exists
    if exist "%LOG_FILE%" del "%LOG_FILE%"
)

if not "%CD%"=="%SCRIPT_DIR_CREATE_NEW_POLICY_VERSION%" (
    echo Changing directory to the script location
    echo Changing directory to the script location >> %LOG_FILE%
    cd %SCRIPT_DIR_CREATE_NEW_POLICY_VERSION%
) else (
    echo Already in the script location
    echo Already in the script location >> %LOG_FILE%
)

rem Iterate through each .json file in the policies folder
for %%f in ("%POLICIES_FOLDER%\*.json") do (
    rem Extract policy name from filename
    set "FILENAME=%%~nf"
    
    echo Filename Found !FILENAME! extracting the policy name
    echo Filename Found !FILENAME! extracting the policy name >> %LOG_FILE%
    echo Calling aws iam list-policy-versions
    echo Calling aws iam list-policy-versions >> %LOG_FILE%
    
    call aws iam list-policy-versions --policy-arn arn:aws:iam::%ACCOUNT_ID%:policy/!FILENAME! --profile %AWS_PROFILE%> temp_list_policy_versions-output.txt 2>&1
    
@REM aws iam list-policy-versions --policy-arn arn:aws:iam::697426589657:policy/GetAskDaoJournalPolicy-DEV --profile %AWS_PROFILE%> temp_list_policy_versions-output.txt 2>&1
    echo temp_list_policy_versions-output.txt:
    echo temp_list_policy_versions-output.txt: >> %LOG_FILE%
    type temp_list_policy_versions-output.txt
    type temp_list_policy_versions-output.txt >> %LOG_FILE%
    rem Initialize variables
    set "LAST_VERSION_ID="
    set "CHECK_FOR_DEFAULT=false"
    set "LATEST_VERSION="
     
    rem Process the output file
    for /f "tokens=2 delims=:," %%a in ('type temp_list_policy_versions-output.txt ^| findstr /R "VersionId IsDefaultVersion"') do (
        rem Skip the rest of the loop if the latest version has already been found
        echo Current line: %%a
        if "!CURRENT_VERSION_ID!" == "" (
            echo Found a line with VersionId.
            echo Found a line with VersionId. >> %LOG_FILE%
            set "VERSION_ID_WITH_QUOTES=%%~a"
            for /f "tokens=* delims= " %%i in ("!VERSION_ID_WITH_QUOTES!") do set "CURRENT_VERSION_ID=%%~i"
            echo Processed VersionId without leading whitespaces and quotes:!CURRENT_VERSION_ID!
            echo Processed VersionId without leading whitespaces and quotes:!CURRENT_VERSION_ID! >> %LOG_FILE%
    ) else (
        echo Found a line with IsDefaultVersion. Raw value: %%a
        echo Found a line with IsDefaultVersion. Raw value: %%a >> %LOG_FILE%
        rem Remove leading and trailing whitespace from %%a
        for /f "tokens=*" %%b in ("%%a") do set "CLEANED_VERSION_FLAG=%%b"
        echo Checking if cleaned IsDefaultVersion:!CLEANED_VERSION_FLAG! is "true"
        echo Checking if cleaned IsDefaultVersion:!CLEANED_VERSION_FLAG! is "true" >> %LOG_FILE%
        
        if "!CLEANED_VERSION_FLAG!" == "true" (
            set "LATEST_VERSION=!CURRENT_VERSION_ID!"
            echo Found default version: !LATEST_VERSION!
            echo Found default version: !LATEST_VERSION! >> %LOG_FILE%
        ) else (
            
            echo Deleting Version_ID: !CURRENT_VERSION_ID!
            echo Deleting Version_ID: !CURRENT_VERSION_ID! >> %LOG_FILE%
            call aws iam delete-policy-version --policy-arn arn:aws:iam::%ACCOUNT_ID%:policy/!FILENAME! --version-id !CURRENT_VERSION_ID! --profile %AWS_PROFILE%>> %LOG_FILE%
            echo Deleted Version_ID: !CURRENT_VERSION_ID!
            echo Deleted Version_ID: !CURRENT_VERSION_ID! >> %LOG_FILE%
            
        )
        
        rem Reset CURRENT_VERSION_ID for the next pair
        set "CURRENT_VERSION_ID="
        )
    )
)
rem Clean up the temporary output file
del temp_list_policy_versions-output.txt
