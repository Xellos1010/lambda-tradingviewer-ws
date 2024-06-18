if not defined AWS_PROFILE set AWS_PROFILE=SystemDeveloper-Xellos

rem Create the Roles and Assign the Policies
echo Creating Role...
echo. Creating Role... >> %LOG_FILE%
aws iam create-role --role-name %ROLE_NAME% --assume-role-policy-document "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"lambda.amazonaws.com\"},\"Action\":\"sts:AssumeRole\"}]}" --profile %AWS_PROFILE% >> %LOG_FILE% 2>&1

rem Create Additional Policies
call create-policies-%STAGE%.bat

rem Attach Additional Policies
call attach-policies-%STAGE%.bat

echo. Execution Role and Policies Created and assigned.
echo. Execution Role and Policies Created and assigned. >> %LOG_FILE%
