@REM zip-file.bat

rem Check if %ZIP_FILE% exists and delete it if it does
if exist %ZIP_FILE% (
    echo Deleting existing ZIP file: %ZIP_FILE%
    echo Deleting existing ZIP file: %ZIP_FILE% >> %LOG_FILE% 2>&1
    del %ZIP_FILE% >> %LOG_FILE% 2>&1
)

rem Compress files using 7z
echo Compressing project files into ZIP...
echo Compressing project files into ZIP... >> %LOG_FILE% 2>&1

cd dist
7z a "../%ZIP_FILE%" * -r
cd ..
if %errorlevel% neq 0 (
    echo Compression failed. Check 7z output in the log file for details. >> "%LOG_FILE%"
    exit /b 1
)
echo Compression complete.