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
    set LOG_FILE=%CALLINGDIRECTORY_CREATE_NEW_POLICY_VERSIONS%\debug-create_new_policy_version-%ENV%.log
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
    
    call aws iam list-policy-versions --policy-arn arn:aws:iam::%ACCOUNT_ID%:policy/!FILENAME! --profile %AWS_PROFILE% > temp_list_policy_versions-output.txt 2>&1
    
@REM aws iam list-policy-versions --policy-arn arn:aws:iam::697426589657:policy/GetAskDaoJournalPolicy-DEV --profile %AWS_PROFILE% > temp_list_policy_versions-output.txt 2>&1
    type temp_list_policy_versions-output.txt
    rem Initialize variables
    set "LAST_VERSION_ID="
    set "CHECK_FOR_DEFAULT=false"
    set "LATEST_VERSION="
     
    rem Process the output file
    for /f "tokens=2 delims=:," %%a in ('type temp_list_policy_versions-output.txt ^| findstr /R "VersionId IsDefaultVersion"') do (
        rem Skip the rest of the loop if the latest version has already been found
        if not "!LATEST_VERSION!" == "" (
            rem Skipping the rest of the processing
            echo Skipping the rest of the processing
            echo Skipping the rest of the processing >> LOG_FILE
        ) else (
            echo Current line: %%a
            if "!CURRENT_VERSION_ID!" == "" (
                echo Found a line with VersionId.
                set "VERSION_ID_WITH_QUOTES=%%~a"
                for /f "tokens=* delims= " %%i in ("!VERSION_ID_WITH_QUOTES!") do set "CURRENT_VERSION_ID=%%~i"
                echo Processed VersionId without leading whitespaces and quotes:!CURRENT_VERSION_ID!
        ) else (
            echo Found a line with IsDefaultVersion. Raw value: %%a
            rem Remove leading and trailing whitespace from %%a
            for /f "tokens=*" %%b in ("%%a") do set "CLEANED_VERSION_FLAG=%%b"
            echo Checking if cleaned IsDefaultVersion:!CLEANED_VERSION_FLAG! is "true"
            
            if "!CLEANED_VERSION_FLAG!" == "true" (
                set "LATEST_VERSION=!CURRENT_VERSION_ID!"
                echo Found default version: !LATEST_VERSION!
            )
            
            rem Reset CURRENT_VERSION_ID for the next pair
            set "CURRENT_VERSION_ID="
            )
        )
    )

    
    if not "!LATEST_VERSION!" == "" (
        echo LATEST_VERSION: !LATEST_VERSION!
        echo LATEST_VERSION: !LATEST_VERSION! >> %LOG_FILE%
    ) else (
        echo No default version found.
        echo No default version found. >> %LOG_FILE%
    )
    
    del temp_list_policy_versions-output.txt
    rem Check if the old policy version exists
    call aws iam get-policy-version --policy-arn arn:aws:iam::%ACCOUNT_ID%:policy/!FILENAME! --version-id !LATEST_VERSION! --profile %AWS_PROFILE% > temp_list_policy_versions-output.txt 2>&1
    rem After running the AWS command to get policy version
    set "CURRENT_POLICY_VERSION_INFO="
    for /f "delims=" %%a in ('type "%SCRIPT_DIR_CREATE_NEW_POLICY_VERSION%\temp_list_policy_versions-output.txt"') do (
        set "CURRENT_POLICY_VERSION_INFO=!CURRENT_POLICY_VERSION_INFO!%%a"
    )
    echo temp_put filepath: %SCRIPT_DIR_CREATE_NEW_POLICY_VERSION%\temp_list_policy_versions-output.txt
    echo Content of temp_list_policy_versions-output.txt:
    type "%SCRIPT_DIR_CREATE_NEW_POLICY_VERSION%\temp_list_policy_versions-output.txt"
    rem After running the AWS command to get policy version
    echo CURRENT_POLICY_VERSION_INFO:
    echo !CURRENT_POLICY_VERSION_INFO!
    echo CURRENT_POLICY_VERSION_INFO: >> %LOG_FILE%
    echo !CURRENT_POLICY_VERSION_INFO! >> %LOG_FILE%

    rem Find the start and end of the "Document" section
    set "START_POS=0"
    for /f "delims=" %%i in ('echo !CURRENT_POLICY_VERSION_INFO! ^| findstr /b /c:"Document"') do (
        set /a "START_POS=%%i"
    )

    set "CURRENT_VERSION_DOCUMENT_CONTENT="
    set "IN_DOCUMENT=false"
    for %%i in (!CURRENT_POLICY_VERSION_INFO!) do (
        if !IN_DOCUMENT! == true (
            set "CURRENT_VERSION_DOCUMENT_CONTENT=!CURRENT_VERSION_DOCUMENT_CONTENT! %%i"
            echo %%i | findstr /c:"}" > nul
            if not errorlevel 1 set "IN_DOCUMENT=false"
        ) else (
            echo %%i | findstr /c:"Document" > nul
            if not errorlevel 1 set "IN_DOCUMENT=true"
        )
    )

    echo Document section:
    echo !CURRENT_VERSION_DOCUMENT_CONTENT!

    
    rem Check if the old policy exists and compare its contents with the policy file
    if "!CURRENT_POLICY_VERSION_INFO!" == "" (
        echo CURRENT_POLICY_VERSION_INFO does not exist: !FILENAME!
        echo CURRENT_POLICY_VERSION_INFO does not exist: !FILENAME! >> %LOG_FILE%
    ) else (
            rem Compare the old policy JSON with the contents of the policy file
            echo Comparing current version document policy info and policy info JSON for !FILENAME!...
            echo Comparing current version document policy info and policy info JSON for !FILENAME!... >> %LOG_FILE%
            
            @REM Display the contents of the new policy JSON (the policy file)
            echo Contents of the policy JSON
            echo Contents of the policy JSON >> %LOG_FILE%
            type %POLICIES_FOLDER%\!FILENAME!.json
            type %POLICIES_FOLDER%\!FILENAME!.json >> %LOG_FILE%

            rem Read and concatenate the second JSON file into a single line
            set "POLICY_FOLDER_NORMALIZED_JSON="
            for /f "delims=" %%a in ('type "%POLICIES_FOLDER%\!FILENAME!.json"') do (
                set "POLICY_FOLDER_NORMALIZED_JSON=!POLICY_FOLDER_NORMALIZED_JSON!%%a"
            )

            echo POLICY_FOLDER_NORMALIZED_JSON:
            echo !POLICY_FOLDER_NORMALIZED_JSON!
            echo POLICY_FOLDER_NORMALIZED_JSON: >> %LOG_FILE%
            echo !POLICY_FOLDER_NORMALIZED_JSON! >> %LOG_FILE%
            
            echo CURRENT_VERSION_DOCUMENT_CONTENT:
            echo !CURRENT_VERSION_DOCUMENT_CONTENT!
            echo CURRENT_VERSION_DOCUMENT_CONTENT: >> %LOG_FILE%
            echo !CURRENT_VERSION_DOCUMENT_CONTENT! >> %LOG_FILE%
            
            rem Normalize POLICY_FOLDER_NORMALIZED_JSON by removing all whitespace
            set "POLICY_FOLDER_NORMALIZED_JSON_NO_WHITESPACE=!POLICY_FOLDER_NORMALIZED_JSON: =!"

            rem Normalize POLICY_FOLDER_NORMALIZED_JSON by removing all whitespace and commas
            set "POLICY_FOLDER_NORMALIZED_JSON_NO_WHITESPACE=!POLICY_FOLDER_NORMALIZED_JSON: =!"

            rem **Architectural Decision** We need to remove comma's because extracting the Document from the Policy version removes comma's automatically
            set "POLICY_FOLDER_NORMALIZED_JSON_NO_WHITESPACE=!POLICY_FOLDER_NORMALIZED_JSON_NO_WHITESPACE:,=!"

            rem **Architectural Decision** We need to remove the last four characters "}}]}" from POLICY_FOLDER_NORMALIZED_JSON_NO_WHITESPACE
            set "POLICY_FOLDER_NORMALIZED_JSON_NO_WHITESPACE_LAST_FOUR_REMOVED=!POLICY_FOLDER_NORMALIZED_JSON_NO_WHITESPACE:~0,-3!"

            echo POLICY_FOLDER_NORMALIZED_JSON_NO_WHITESPACE:
            echo !POLICY_FOLDER_NORMALIZED_JSON_NO_WHITESPACE_LAST_FOUR_REMOVED!
            echo POLICY_FOLDER_NORMALIZED_JSON_NO_WHITESPACE: >> %LOG_FILE%
            echo !POLICY_FOLDER_NORMALIZED_JSON_NO_WHITESPACE_LAST_FOUR_REMOVED! >> %LOG_FILE%


            rem Normalize CURRENT_VERSION_DOCUMENT_CONTENT by removing all whitespace
            set "CURRENT_VERSION_DOCUMENT_CONTENT_NO_WHITESPACE=!CURRENT_VERSION_DOCUMENT_CONTENT: =!"

            echo CURRENT_VERSION_DOCUMENT_CONTENT_NO_WHITESPACE:
            echo !CURRENT_VERSION_DOCUMENT_CONTENT_NO_WHITESPACE!
            echo CURRENT_VERSION_DOCUMENT_CONTENT_NO_WHITESPACE: >> %LOG_FILE%
            echo !CURRENT_VERSION_DOCUMENT_CONTENT_NO_WHITESPACE! >> %LOG_FILE%

            
            rem Compare the normalized content
            if not "!CURRENT_VERSION_DOCUMENT_CONTENT_NO_WHITESPACE!" == "!POLICY_FOLDER_NORMALIZED_JSON_NO_WHITESPACE_LAST_FOUR_REMOVED!" (
                echo Policies are different: !FILENAME!
                echo Policies are different: !FILENAME! >> %LOG_FILE%
                
                
                rem Attach the policy to the role and capture the output as JSON
                call aws iam create-policy-version --policy-arn arn:aws:iam::%ACCOUNT_ID%:policy/!FILENAME! --policy-document file://./%POLICIES_FOLDER%/!FILENAME!.json --set-as-default --profile %AWS_PROFILE%
                
                rem Check the exit code of the aws command
                if %errorlevel% equ 0 (
                    echo Policy Update success: !FILENAME!
                    echo Policy Update success: !FILENAME! >> %LOG_FILE%
                ) else (
                    echo Policy Update failed: !FILENAME!
                    echo Policy Update failed: !FILENAME! >> %LOG_FILE%
                )
            ) else (
                echo Policy Version and JSON policy are the same: !FILENAME!
                echo Policy Version and JSON policy are the same: !FILENAME! >> %LOG_FILE%
                
            )
        )
    )
@REM rem Clean up the temporary output file
del temp_list_policy_versions-output.txt
