@REM aws-cli-setup\API-Gateway-LambdaFunctions\package-update-base.bat
@echo off
setlocal

set AWS_PROFILE=SystemDeveloper-Xellos
set "LOG_FILE=%~dp0package-update-dev.log"

rem Set the ZIP file path and run the zip script
set "ZIP_FILE_FILEPATH=%~dp0zip-file.bat"
echo "Setting ZIP_FILE_FILEPATH to %ZIP_FILE_FILEPATH%"
call %ZIP_FILE_FILEPATH%

rem Execute AWS CLI command to update Lambda function code
echo Updating Lambda function with AWS CLI...
echo Updating Lambda function with AWS CLI... >> %LOG_FILE% 2>&1
aws lambda update-function-code --function-name %FUNCTION_NAME% --zip-file fileb://%ZIP_FILE% --profile %AWS_PROFILE% >> %LOG_FILE% 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error updating Lambda function code. Check logs for details.
    echo Error updating Lambda function code. Check logs for details. >> %LOG_FILE% 2>&1
    goto end
)

rem Publish a new version and update the alias
echo Publishing new version and updating %ENV% alias...
for /f "tokens=*" %%A in ('aws lambda publish-version --function-name %FUNCTION_NAME% --query Version --output text --profile %AWS_PROFILE% 2^>nul') do (
    set VERSION=%%A
)

if defined VERSION (
    echo Version published: %VERSION%
    echo Version published: %VERSION% >> %LOG_FILE% 2>&1

    echo Updating alias...
    echo Updating alias... >> %LOG_FILE% 2>&1
    aws lambda update-alias --function-name %FUNCTION_NAME% --name %ENV% --function-version %VERSION% --profile %AWS_PROFILE% >> %LOG_FILE% 2>&1
    if %ERRORLEVEL% neq 0 (
        echo Error updating alias. Check logs for details.
        echo Error updating alias. Check logs for details. >> %LOG_FILE% 2>&1
        goto end
    ) else (
        echo Successfully updated alias %ENV% to version %VERSION%.
        echo Successfully updated alias %ENV% to version %VERSION%. >> %LOG_FILE% 2>&1
    )
) else (
    echo Error publishing new version. Check logs for details.
    echo Error publishing new version. Check logs for details. >> %LOG_FILE% 2>&1
    goto end
)

rem Update API Gateway integration for each stage
echo Updating API Gateway integration for stage %STAGE%...
echo Updating API Gateway integration for stage %STAGE%... >> %LOG_FILE% 2>&1
aws apigateway put-integration --rest-api-id %REST_API_ID% --resource-id %RESOURCE_ID% --http-method %HTTP_METHOD% --type "AWS_PROXY" --integration-http-method %HTTP_METHOD% --uri "arn:aws:apigateway:%REGION%:lambda:path/2015-03-31/functions/arn:aws:lambda:%REGION%:%ACCOUNT_ID%:function:%FUNCTION_NAME%:%STAGE%/invocations" --region %REGION% --profile %AWS_PROFILE% >> %LOG_FILE% 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error updating API Gateway integration. Check logs for details.
    echo Error updating API Gateway integration. Check logs for details. >> %LOG_FILE% 2>&1
) else (
    echo Successfully updated API Gateway integration for stage %STAGE%.
    echo Successfully updated API Gateway integration for stage %STAGE%. >> %LOG_FILE% 2>&1
)

:end
echo Script execution completed.
echo Script execution completed. >> %LOG_FILE% 2>&1
endlocal
