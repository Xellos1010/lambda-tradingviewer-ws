@REM package-deploy-base.bat
@REM Has to be called form a sub-directory lambda function deploy to have the environment variables set correctly

set "ZIP_FILE_FILEPATH=%~dp0zip-file.bat"
if not defined AWS_PROFILE set AWS_PROFILE=SystemDeveloper-Xellos

echo "Setting ZIP_FILE_FILEPATH to %ZIP_FILE_FILEPATH%"

call %ZIP_FILE_FILEPATH%

rem Call the script to create the tables
echo Calling script to create the tables
echo Calling script to create the tables. >> %LOG_FILE% 2>&1
call aws-setup-scripts\%ENV%\create_tables-%STAGE%.bat
echo Role creation and policy assignment script execution completed. 
echo Role creation and policy assignment script execution completed. >> %LOG_FILE% 2>&1 

rem Call the script to create the roles and assign the policies
echo Calling script to create roles and assign policies.
echo Calling script to create roles and assign policies. >> %LOG_FILE% 2>&1
call aws-setup-scripts\%ENV%\create-role-%STAGE%.bat
echo Role creation and policy assignment script execution completed. 
echo Role creation and policy assignment script execution completed. >> %LOG_FILE% 2>&1 

rem Execute AWS CLI command to deploy Lambda function code
echo Deploying Lambda function with AWS CLI...
echo Deploying Lambda function with AWS CLI... >> %LOG_FILE% 2>&1
aws lambda create-function --function-name %FUNCTION_NAME% --runtime %RUNTIME% --role arn:aws:iam::%ACCOUNT_ID%:role/%ROLE_NAME% --handler index.handler --zip-file fileb://%ZIP_FILE% --profile %AWS_PROFILE% >> %LOG_FILE% 2>&1
echo Lambda function deployment completed.
echo Lambda function deployment completed. >> %LOG_FILE% 2>&1

echo Publishing new version and updating %ENV% alias...
for /f "tokens=*" %%A in ('aws lambda publish-version --function-name %FUNCTION_NAME% --query Version --output text --profile %AWS_PROFILE% 2^>nul') do (
    set VERSION=%%A
)
if defined VERSION (
    echo Version published: %VERSION%
    echo Creating or updating alias...
    aws lambda create-alias --function-name %FUNCTION_NAME% --name %ENV% --function-version %VERSION% --profile %AWS_PROFILE% >> %LOG_FILE% 2>&1 || (
        aws lambda update-alias --function-name %FUNCTION_NAME% --name %ENV% --function-version %VERSION% --profile %AWS_PROFILE% >> %LOG_FILE% 2>&1
    )
) else (
    echo Error publishing new version. Check logs for details.
    echo Error publishing new version. Check logs for details. >> %LOG_FILE% 2>&1
    goto end
)

rem Create the Logs for the Function
echo Creating log group for the Lambda function...
echo Creating log group for the Lambda function... >> %LOG_FILE% 2>&1
aws logs create-log-group --log-group-name /aws/lambda/%FUNCTION_NAME% --profile %AWS_PROFILE% >> %LOG_FILE% 2>&1
echo Log group creation completed.
echo Log group creation completed. >> %LOG_FILE% 2>&1

rem Call the script to Update the configuration
echo Updating environment configuration with provided script...
echo Updating environment configuration with provided script... >> %LOG_FILE% 2>&1
call aws-setup-scripts\%ENV%\update_env-%STAGE%.bat
echo Environment configuration update script execution completed.
echo Environment configuration update script execution completed. >> %LOG_FILE% 2>&1

rem Get the ARN of the newly created Lambda function
echo Retrieving ARN of the newly created Lambda function...
echo Retrieving ARN of the newly created Lambda function... >> %LOG_FILE% 2>&1
for /f "delims=" %%a in ('aws lambda get-function --function-name %FUNCTION_NAME% --profile %AWS_PROFILE% --query Configuration.FunctionArn --output text 2^>^&1') do (
    set FUNCTION_ARN=%%a
)
if defined FUNCTION_ARN (
    echo ARN retrieved: %FUNCTION_ARN%
    echo ARN retrieved: %FUNCTION_ARN% >> %LOG_FILE% 2>&1
) else (
    echo ARN not retrieved, check logs for details.
)

echo Updating API.
echo Updating API. >> %LOG_FILE% 2>&1
call aws-setup-scripts\%ENV%\update-api-%STAGE%.bat

:end
echo Base Package Deploy Script execution completed.
echo Base Package Deploy Script execution completed. >> %LOG_FILE% 2>&1
rem End of script