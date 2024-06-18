@echo off
setlocal

REM The first argument is the target directory
set "TARGET_DIR=%~1"
set "LOG_FILE=%~2"

REM Use LOG_FILE and LOGGER_PATH from the environment
if not "%CD%"=="%TARGET_DIR%" (
    CALL "%LOGGER_PATH%" "Changing directory to the script location" "%LOG_FILE%"
    cd /D "%TARGET_DIR%"
) else (
    CALL "%LOGGER_PATH%" "Already in the script location" "%LOG_FILE%"
)

endlocal