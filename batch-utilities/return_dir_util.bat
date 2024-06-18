@echo off
setlocal

REM The first argument is the original directory to return to
set "ORIGINAL_DIR=%~1"

REM The second argument is the log file path
set "LOG_FILE=%~2"

if not "%CD%"=="%ORIGINAL_DIR%" (
    CALL "%LOGGER_PATH%" "Changing back to the original directory" "%LOG_FILE%"
    cd /D "%ORIGINAL_DIR%"
) else (
    CALL "%LOGGER_PATH%" "Already in the original directory" "%LOG_FILE%"
)

endlocal
