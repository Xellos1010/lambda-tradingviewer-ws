@echo off
setlocal enabledelayedexpansion

REM Capture the stage and the name of the calling script
set "STAGE=%~1"
set "CALLING_SCRIPT=%~2"

REM Convert STAGE to uppercase for the ENV variable
set "ENV=!STAGE!"
for %%i in ("a=A" "b=B" "c=C" "d=D" "e=E" "f=F" "g=G" "h=H" "i=I" "j=J" "k=K" "l=L" "m=M" "n=N" "o=O" "p=P" "q=Q" "r=R" "s=S" "t=T" "u=U" "v=V" "w=W" "x=X" "y=Y" "z=Z") do (
    set "ENV=!ENV:%%~i!"
)

@REM This assumes the calling script has not changed it's directory
REM Call the shared environment script
CALL .\env.bat "%CALLING_SCRIPT%"

REM Pass back the environment variables
endlocal & (
    set "STAGE=%STAGE%"
    set "ENV=%ENV%"
    set "LOGS_DIR=%LOGS_DIR%"
    set "LOG_FILE=%LOG_FILE%"
    set "LOGGER_PATH=%LOGGER_PATH%"
    set "ENV_SET=%ENV_SET%"
    set "FUNCTION_DESCRIPTION=%FUNCTION_DESCRIPTION%"
    set "FUNCTION_NAME=%FUNCTION_NAME%"
    set "ZIP_FILE=%ZIP_FILE%"
    set "RUNTIME=%RUNTIME%"
    set "ROLE_NAME=%ROLE_NAME%"
    set "ACCOUNT_ID=%ACCOUNT_ID%"
    set "ROLE_ARN=%ROLE_ARN%"
    set "HANDLER=%HANDLER%"
    set "LOG_GROUP_NAME=%LOG_GROUP_NAME%"
    set "REST_API_ID=%REST_API_ID%"
    set "RESOURCE_ID=%RESOURCE_ID%"
    set "HTTP_METHOD=%HTTP_METHOD%"
    set "ENDPOINT_NAME=%ENDPOINT_NAME%"
    set "REGION=%REGION%"
    set "CHANGE_DIR_UTIL_PATH=%CHANGE_DIR_UTIL_PATH%"
)
