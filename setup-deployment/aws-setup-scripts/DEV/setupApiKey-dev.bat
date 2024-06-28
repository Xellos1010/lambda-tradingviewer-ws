@echo off
setlocal enabledelayedexpansion

echo Setting up variables...
set CALLINGDIRECTORY=%CD%
set SCRIPT_DIR=%~dp0
set SCRIPT_DIR=%SCRIPT_DIR:~0,-1%

if not defined STAGE set "STAGE=dev"
if not defined ENV set "ENV=DEV"
if not defined PROFILE set "PROFILE=SystemDeveloper"
if not defined API_ID set "API_ID=xb8z31jg5g"
if not defined RESOURCE_ID set "RESOURCE_ID=yny2bs"
if not defined USAGE_PLAN_NAME set "USAGE_PLAN_NAME=AskDaoUsagePlan"
if not defined USAGE_PLAN_DESCRIPTION set "USAGE_PLAN_DESCRIPTION=Ask Dao Usage plan"
if not defined API_KEY_NAME set "API_KEY_NAME=AskDaoApiKey"
set "APIKEY_FILE_PATH=APIKey-%ENV%.txt"

echo Setting up the log file...
if not defined LOG_FILE (
    set "LOG_FILE=%CALLINGDIRECTORY%\debug-setup-apikey-%ENV%.log"
    if exist "%LOG_FILE%" (
        echo Deleting existing log file...
        del "%LOG_FILE%"
    )
)

REM Log the AWS CLI command and its output
echo Running AWS CLI command to check if the API key already exists...
echo Running AWS CLI command to check if the API key already exists... >> %LOG_FILE%
aws apigateway get-api-keys --name-query "%API_KEY_NAME%" --query "items[0].id" --output text --profile %PROFILE% > temp_api_key_output.txt 2>&1
type temp_api_key_output.txt >> %LOG_FILE%

REM Check if the API key already exists
set "API_KEY_ID="
for /f "tokens=*" %%i in ('type temp_api_key_output.txt') do (
    echo Checking line %%i
    echo Checking line %%i >> %LOG_FILE%
    set "API_KEY_ID=%%i"
    if not "!API_KEY_ID!"=="None" (
        echo API key already exists. ID: !API_KEY_ID!
        echo API key already exists. ID: !API_KEY_ID! >> %LOG_FILE%
        goto endApiKeyLoop
    )
    else (
        REM If the API key does not exist, create it
        echo Creating API key and saving it to file...
        echo Creating API key and saving it to file... >> %LOG_FILE%
        aws apigateway create-api-key --name "%API_KEY_NAME%" --enabled --profile %PROFILE% >> %APIKEY_FILE_PATH% 2>&1
        type %APIKEY_FILE_PATH%
        type %APIKEY_FILE_PATH% >> %LOG_FILE% 2>&1
        for /f "tokens=*" %%i in ('type "%APIKEY_FILE_PATH%" ^| findstr /i "id"') do (
            set "API_KEY_ID=%%i"
            set API_KEY_ID=!API_KEY_ID:*id=!
            echo API key createdt: !API_KEY_ID!  
            echo API key created: !API_KEY_ID! >> %LOG_FILE%
        )
    )
)


:endApiKeyLoop
pause
REM Clean up temporary files
del temp_api_key_output.txt
echo Checking if the Usage Plan already exists...
echo Checking if the Usage Plan already exists... >> %LOG_FILE%
echo aws apigateway get-usage-plans --query "items[?name=='%USAGE_PLAN_NAME%'].id" --output text --profile %PROFILE% > temp_command.txt
aws apigateway get-usage-plans --query "items[?name=='%USAGE_PLAN_NAME%'].id" --output text --profile %PROFILE% > temp_usage_plan_ids.txt
type temp_usage_plan_ids.txt >> %LOG_FILE%
pause
set USAGE_PLAN_ID_FOUND=false
for /f "tokens=*" %%i in (temp_usage_plan_ids.txt) do (
    if "%%i" NEQ "" (
        set "USAGE_PLAN_ID=%%i"
        set USAGE_PLAN_ID_FOUND=true
        goto processUsagePlanId
    )
)
pause
:processUsagePlanId
if %USAGE_PLAN_ID_FOUND%==true (
    echo Usage plan already exists. ID: %USAGE_PLAN_ID%
    echo Usage plan already exists. ID: %USAGE_PLAN_ID% >> %LOG_FILE%
) else (
    echo Creating Usage Plan and capturing its ID...
    echo Creating Usage Plan and capturing its ID... >> %LOG_FILE%
    aws apigateway create-usage-plan --name "%USAGE_PLAN_NAME%" --description "%USAGE_PLAN_DESCRIPTION%" --api-stages "apiId=%API_ID%,stage=dev" --throttle "rateLimit=1000,burstLimit=2000" --profile %PROFILE% > temp.txt
    type temp.txt >> %LOG_FILE%
    for /f "tokens=2 delims=: " %%i in ('type temp.txt ^| findstr /i "id"') do set "USAGE_PLAN_ID=%%i"
    set USAGE_PLAN_ID=!USAGE_PLAN_ID:~1,-1!
    echo Usage Plan ID: !USAGE_PLAN_ID!
    echo Usage Plan ID: !USAGE_PLAN_ID! >> %LOG_FILE
    del temp.txt
)
REM Cleanup
del temp_usage_plan_ids.txt
pause
echo Checking for existing Usage Plan Key...
echo Checking for existing Usage Plan Key... >> %LOG_FILE% 2>&1
aws apigateway get-usage-plan-keys --usage-plan-id !USAGE_PLAN_ID! --profile %PROFILE% > temp_usage_plan_keys.txt
type temp_usage_plan_keys.txt
type temp_usage_plan_keys.txt >> %LOG_FILE%  2>&1
pause
REM Check if API_KEY_ID is in the list of usage plan keys
for /f "tokens=*" %%i in ('type temp_usage_plan_keys.txt ^| findstr /i %API_KEY_ID%') do set "EXISTING_KEY_ID=%%i"
if defined EXISTING_KEY_ID (
    echo Usage Plan Key already exists.
    echo Usage Plan Key already exists. >> %LOG_FILE%
) else (
    echo Creating Usage Plan Key with the extracted ID...
    echo Creating Usage Plan Key with the extracted ID... >> %LOG_FILE%
    aws apigateway create-usage-plan-key --usage-plan-id !USAGE_PLAN_ID! --key-id %API_KEY_ID% --key-type "API_KEY" --profile %PROFILE% >> %LOG_FILE%
)
pause
echo Writing API Key ID to file...
echo %API_KEY_ID% > "APIKeyID-%ENV%.txt"

REM Cleanup
del temp_usage_plan_keys.txt

echo API Key setup completed.
echo API Key setup completed. >> %LOG_FILE%

:end
echo Script execution completed.
echo Script execution completed. >> %LOG_FILE%
if not "%CD%"=="%CALLINGDIRECTORY%" (
    echo Changing back to the original directory
    echo Changing back to the original directory >> %LOG_FILE%
    cd %CALLINGDIRECTORY%
)

endlocal
