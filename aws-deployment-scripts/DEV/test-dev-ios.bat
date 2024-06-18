@echo off
setlocal enabledelayedexpansion

REM Define the initial curl command and store the response in a temporary file
echo Sending iOS Key Exchange request...
curl -k -X POST -H "x-api-key: OFrtHIhIsIau5MVSsWmy46wCKAIw9sSW3Whbs6Mk" -H "Content-Type: application/json" -d "{\"deviceUUID\":\"f9b86e4a9bd91c2c4b1e242b067c52ef6919c083b89e1899f2ed208cb3734af7\",\"application_identifier\":\"com.hepe.askdaokapra\",\"apiVersion\":\"1.0.0\", \"applicationVersion\":\"1.0.7\", \"devicePlatform\":\"iOS\",\"environment\":\"dev\"}" https://xb8z31jg5g.execute-api.us-east-1.amazonaws.com/dev/versionCheck
echo
