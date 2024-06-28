@echo off
setlocal enabledelayedexpansion

echo Setting up initial variables...
echo Setting up initial variables... >> %LOG_FILE%
set CALLINGDIRECTORY=%CD%
set SCRIPT_DIR=%~dp0
set SCRIPT_DIR=%SCRIPT_DIR:~0,-1%

if not defined STAGE set "STAGE=dev"
if not defined ENV set "ENV=DEV"

echo Setting up the log file...
if not defined LOG_FILE (
    set LOG_FILE=%CALLINGDIRECTORY%\debug-create-endpoint-%ENV%.log
    if exist "%LOG_FILE%" (
        echo Deleting existing log file...
        del "%LOG_FILE%"
    )
)

echo Checking and changing the directory to the script location...
echo Checking and changing the directory to the script location... >> %LOG_FILE%
if not "%CD%"=="%SCRIPT_DIR%" (
    echo Changing directory to the script location
    echo Changing directory to the script location >> %LOG_FILE%
    cd %SCRIPT_DIR%
) else (
    echo Already in the script location
    echo Already in the script location >> %LOG_FILE%
)
echo Defining variables for API Gateway...
echo Defining variables for API Gateway... >> %LOG_FILE%
if not defined API_ID set "API_ID=xy52jc9g9b"
if not defined PARENT_ID set "PARENT_ID=a4lgqcmsm4"
if not defined PATH_PART set "PATH_PART=webhook"
if not defined AWS_PROFILE set "AWS_PROFILE=SystemDeveloper-Xellos"


echo Checking if the resource already exists...
echo Checking if the resource already exists... >> %LOG_FILE%
aws apigateway get-resources --rest-api-id %API_ID% --profile %AWS_PROFILE% > temp_resources_output.txt
type temp_resources_output.txt >> %LOG_FILE%

REM Extract RESOURCE_ID from the output
set "LAST_ID="
echo Checking the output of the get-resource call
echo Checking the output of the get-resource call >> %LOG_FILE%
REM Reading each line from the output file
for /f "tokens=*" %%i in ('type temp_resources_output.txt') do (
    echo checking line %%i
    echo checking line %%i >> %LOG_FILE%
    
    REM Splitting each line by colon to get key-value pairs
    for /f "tokens=1,* delims=:" %%a in ("%%i") do (
        set "KEY=%%a"
        set "VALUE=%%b"
        
        REM Remove leading and trailing spaces, commas, and quotes from the key and value
        set "KEY=!KEY: =!"
        set "KEY=!KEY:,=!"
        set "KEY=!KEY:~1,-1!"  REM This removes the quotes from the key
        set "VALUE=!VALUE: =!"
        set "VALUE=!VALUE:,=!"
        set "VALUE=!VALUE:~1,-1!"  REM This removes the quotes from the value

        echo checking key !KEY!
        echo checking key !KEY! >> %LOG_FILE%
        echo checking value !VALUE!
        echo checking value !VALUE! >> %LOG_FILE%

        REM Check if the key is 'id' and store its value
        if "!KEY!"=="id" (
            set "LAST_ID=!VALUE!"
            echo set LAST_ID: !LAST_ID!
            echo set LAST_ID: !LAST_ID! >> %LOG_FILE%
        )

        REM Check if the key is 'pathPart' and match with the desired path part
        if "!KEY!"=="pathPart" (
            if "!VALUE!"=="%PATH_PART%" (
                set "RESOURCE_ID=!LAST_ID!"
                echo RESOURCE_ID: !RESOURCE_ID!
                echo RESOURCE_ID: !RESOURCE_ID! >> %LOG_FILE%
                goto foundResource
            )
        )
    )
)

:foundResource
del temp_resources_output.txt
if not defined RESOURCE_ID (
    echo Creating the API Gateway resource...
    echo Creating the API Gateway resource... >> %LOG_FILE%
    aws apigateway create-resource --rest-api-id %API_ID% --parent-id %PARENT_ID% --path-part %PATH_PART% --profile %AWS_PROFILE% > temp_create_resource_output.txt
    type temp_create_resource_output.txt >> %LOG_FILE%
    for /f "tokens=*" %%i in ('type temp_create_resource_output.txt ^| findstr /i "id"') do (
        echo checking line %%i
        echo checking line %%i >> %LOG_FILE%
        REM Splitting each line by colon to get key-value pairs
        for /f "tokens=1,* delims=:" %%a in ("%%i") do (
            set "KEY=%%a"
            set "VALUE=%%b"
            REM Remove leading and trailing spaces, commas, and quotes from the key and value
            set "KEY=!KEY: =!"
            set "KEY=!KEY:,=!"
            set "KEY=!KEY:~1,-1!"  REM This removes the quotes from the key
            set "VALUE=!VALUE: =!"
            set "VALUE=!VALUE:,=!"
            set "VALUE=!VALUE:~1,-1!"  REM This removes the quotes from the value

            echo checking key:!KEY!:
            echo checking key:!KEY!: >> %LOG_FILE%
            echo checking value:!VALUE!:
            echo checking value:!VALUE!:>> %LOG_FILE%

            REM Check if the key is 'id' and store its value
            if "!KEY!"=="id" (
                set "RESOURCE_ID=!VALUE!"
                echo set RESOURCE_ID: !RESOURCE_ID!
                echo set RESOURCE_ID: !RESOURCE_ID! >> %LOG_FILE%
                goto resourceidexists
            )
        )
    )
) else (
    echo Resource already exists with ID: !RESOURCE_ID!
    echo Resource already exists with ID: !RESOURCE_ID! >> %LOG_FILE%
)
:resourceidexists
pause
echo Checking if the POST method exists for the resource...
echo Checking if the POST method exists for the resource... >> %LOG_FILE%
aws apigateway get-method --rest-api-id %API_ID% --resource-id !RESOURCE_ID! --http-method POST --profile %AWS_PROFILE% > temp_method_output.txt
type temp_method_output.txt >> %LOG_FILE%

REM Parse the output to check if POST method exists
for /f "tokens=*" %%i in ('type temp_method_output.txt ^| findstr /i "httpMethod"') do set "EXISTING_METHOD=%%i"
if defined EXISTING_METHOD (
    echo POST method already exists.
    echo POST method already exists. >> %LOG_FILE%
) else (
    echo POST method does not exist. Creating the method...
    aws apigateway put-method --rest-api-id %API_ID% --resource-id !RESOURCE_ID! --http-method POST --authorization-type "NONE" --profile %AWS_PROFILE% >> %LOG_FILE% 2>&1
    echo POST method created.
    echo POST method created. >> %LOG_FILE%
)

del temp_method_output.txt

@REM echo Checking if apiKeyRequired needs to be set for the POST method...
@REM echo Checking if apiKeyRequired needs to be set for the POST method... >> %LOG_FILE%
@REM aws apigateway get-method --rest-api-id %API_ID% --resource-id !RESOURCE_ID! --http-method POST --profile %AWS_PROFILE% > temp_method_output.txt
@REM type temp_method_output.txt >> %LOG_FILE%

@REM set "API_KEY_REQUIRED=false"
@REM for /f "tokens=2 delims=: " %%j in ('type temp_method_output.txt ^| findstr /i "apiKeyRequired"') do (
@REM     echo %%j line is being checked for api key required
@REM     echo %%j line is being checked for api key required >> %LOG_FILE%
@REM     set "VALUE=%%j"
@REM     echo !VALUE! line is being cleaned up
@REM     echo !VALUE! line is being cleaned up >> %LOG_FILE%
@REM     set "VALUE=!VALUE: =!"  REM Remove spaces
@REM     set "VALUE=!VALUE:,=!"  REM Remove comma
@REM     echo !VALUE! line is being checked for false
@REM     echo !VALUE! line is being checked for false >> %LOG_FILE%
@REM     if "!VALUE!"=="false" (
@REM         set "API_KEY_REQUIRED=true"
@REM         goto apikeycheck
@REM     )
@REM )
@REM :apikeycheck
@REM del temp_method_output.txt
@REM if "!API_KEY_REQUIRED!"=="true" (
@REM     echo apiKeyRequired is not set for the POST method. Setting it now...
@REM     echo apiKeyRequired is not set for the POST method. Setting it now... >> %LOG_FILE%
@REM     aws apigateway update-method --rest-api-id %API_ID% --resource-id !RESOURCE_ID! --http-method POST --patch-operations op='replace',path='/apiKeyRequired',value='true' --profile %AWS_PROFILE% > temp_update_output.txt 2>&1
@REM     type temp_update_output.txt
@REM     type temp_update_output.txt >> %LOG_FILE%
@REM     del temp_update_output.txt
@REM     echo Update complete.
@REM     echo apiKeyRequired set for the POST method.
@REM     echo apiKeyRequired set for the POST method. >> %LOG_FILE%
@REM ) else (
@REM     echo apiKeyRequired is already set for the POST method.
@REM     echo apiKeyRequired is already set for the POST method. >> %LOG_FILE%
@REM )
@REM echo Adding additional configurations...
@REM echo Adding additional configurations... >> %LOG_FILE%

@REM echo Calling script to set up the API key...
@REM echo Calling script to set up the API key... >> %LOG_FILE%
@REM call ".\%ENV%\setupApiKey-%STAGE%.bat"

:end
echo Script execution completed.
echo Script execution completed. >> %LOG_FILE%
if not "%CD%"=="%CALLINGDIRECTORY%" (
    echo Changing back to the original directory
    echo Changing back to the original directory >> %LOG_FILE%
    cd %CALLINGDIRECTORY%
)

echo Cleaning up temporary files...
echo Cleaning up temporary files... >> %LOG_FILE%
del temp.txt

endlocal
