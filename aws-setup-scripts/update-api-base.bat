if not defined LOG_FILE (
    set LOG_FILE=debug-update-api-%ENV%.log
    rem Delete the log file if it exists
    if exist "%LOG_FILE%" del "%LOG_FILE%"
)

if not defined AWS_PROFILE set AWS_PROFILE=SystemDeveloper-Xellos


rem Remove existing permission if it exists
echo Removing existing permission for Lambda function...
aws lambda remove-permission --function-name %FUNCTION_NAME% --statement-id apigateway-invocation --profile %AWS_PROFILE% 2>&1 | findstr /C:"ResourceNotFoundException"
echo Removed existing permission if it existed.

rem Update API Gateway Integration with the new Lambda ARN
echo Updating API Gateway Integration...
echo Updating API Gateway Integration... >> %LOG_FILE% 2>&1
aws apigateway put-integration --rest-api-id %REST_API_ID% --resource-id %RESOURCE_ID% --http-method %HTTP_METHOD% --type AWS_PROXY --integration-http-method %HTTP_METHOD% --uri arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/%FUNCTION_ARN%/invocations --profile %AWS_PROFILE% >> %LOG_FILE% 2>&1
echo API Gateway Integration update completed.
echo API Gateway Integration update completed. >> %LOG_FILE% 2>&1

rem Deploy the API to the dev stage
echo Deploying API to the dev stage...
echo Deploying API to the dev stage... >> %LOG_FILE% 2>&1
aws apigateway create-deployment --rest-api-id %REST_API_ID% --stage-name %STAGE% --profile %AWS_PROFILE% >> %LOG_FILE% 2>&1
echo API deployment to dev stage completed.
echo API deployment to dev stage completed. >> %LOG_FILE% 2>&1

echo Lambda function and API Gateway setup completed.
echo Lambda function and API Gateway setup completed. >> %LOG_FILE% 2>&1

rem Retrieve Account ID and Region
echo Setting Lambda Function Trigger
echo Setting Lambda Function Trigger >> %LOG_FILE% 2>&1

rem Add permission to Lambda
echo Adding permission to Lambda function...
echo Adding permission to Lambda function... >> %LOG_FILE% 2>&1
aws lambda add-permission --function-name %FUNCTION_NAME% --statement-id apigateway-invocation --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn "arn:aws:execute-api:%REGION%:%ACCOUNT_ID%:%REST_API_ID%/%STAGE%/%HTTP_METHOD%/%ENDPOINT_NAME%" --profile %AWS_PROFILE% >> %LOG_FILE% 2>&1
echo Permission added to Lambda function.
echo Permission added to Lambda function. >> %LOG_FILE% 2>&1