@echo off
set CALLINGDIRECTORY_CREATE_TABLES=%CD%
set SCRIPT_DIR_CREATE_TABLE=%~dp0
set SCRIPT_DIR_CREATE_TABLE=%SCRIPT_DIR_CREATE_TABLE:~0,-1%

rem Define the folder path
if not defined TABLES_FOLDER set "TABLES_FOLDER=.\tables"

if not defined STAGE set STAGE=dev
if not defined ENV set ENV=DEV

if not defined LOG_FILE (
    set LOG_FILE=debug-create_tables-%ENV%.log
    rem Delete the log file if it exists
    if exist "%LOG_FILE%" del "%LOG_FILE%"
)

if not "%CD%"=="%SCRIPT_DIR_CREATE_TABLE%" (
    echo Changing directory to the script location
    echo Changing directory to the script location >> %LOG_FILE%
    cd %SCRIPT_DIR_CREATE_TABLE%
) else (
    echo Already in the script location
    echo Already in the script location >> %LOG_FILE%
)


rem Iterate through each .bat file in the folder
for %%f in ("%TABLES_FOLDER%\*.bat") do (
    echo Calling %%f
    echo Calling %%f >> %LOG_FILE%
    call "%%f" >> %LOG_FILE% 2>&1
)

:end
echo Script execution completed.
echo Script execution completed. >> %LOG_FILE%
if not "%CD%"=="%CALLINGDIRECTORY_CREATE_TABLES%" (
    echo Changing back to the original directory
    echo Changing back to the original directory >> %LOG_FILE%
    cd %CALLINGDIRECTORY_CREATE_TABLES%
)
rem End of script