rem aws-deployment-scripts\DEV\test-dev-visual-studio-buy.bat
@echo off
setlocal enabledelayedexpansion

REM Define the initial curl command and store the response in a temporary file
echo Sending signal buy request...
curl -k -X POST -H "Content-Type: application/json" -d "{\"strategy_name\":\"V2-RSI-BB-Pyramid-v5\",\"strategy_params\":\"(80, 19, close, 10, 200, close, 3, 6, 13, 4, 2, 1, 5, 2,024, 31, 12, 2,024)\",\"order_action\":\"buy\",\"contracts\":\"0.001684\",\"ticker\":\"BTCUSD 30M\",\"position_size\":\"0.001684\"}" https://xy52jc9g9b.execute-api.us-east-1.amazonaws.com/dev/webhook
echo