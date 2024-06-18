@echo off
setlocal
set "LOG_MESSAGE=%~1"
set "LOG_FILE=%~2"

echo %LOG_MESSAGE%
echo %LOG_MESSAGE% >> %LOG_FILE%