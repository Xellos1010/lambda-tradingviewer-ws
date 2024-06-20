# tw-lambda-bot

## Overview
tw-lambda-bot is a Trading View Bot hosted on AWS Lambda, designed to automate trading strategies using signals from Trading View. The bot interacts with exchanges like Coinbase and Binance and is built with Node.js and YARN.

## Table of Contents
1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Deployment](#deployment)
4. [Usage](#usage)
5. [Testing](#testing)
6. [Scripts Overview](#scripts-overview)
7. [License](#license)
8. [Author](#author)

## Installation

### Prerequisites
- Node.js (v20.x)
- YARN
- AWS Account
- AWS CLI with Profile Setup

### Steps
1. *Clone the Repository*
    sh
    git clone https://github.com/yourusername/tw-lambda-bot.git
    cd tw-lambda-bot
    

2. *Install Dependencies*
    sh
    yarn install
    

## Configuration

### Environment Variables
Create a .env file in the root directory and populate it with the following environment variables:

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
DYNAMODB_HOLD_TABLE=TV-Bot-HoldTable
DYNAMODB_SETTING_TABLE=TV-Bot-SettingTable
DYNAMODB_STRATEGY_TABLE=TV-Bot-StrategyTable
DYNAMODB_ORDERS_TABLE=TV-Bot-OrdersTable
COINBASE_API_BASE_URL=api.coinbase.com/api/v3/brokerage


### Lambda Configuration
Create a lambda-config-DEV.json file in aws-setup-scripts\DEV with the following content (excluding sensitive information):
json
{
  "Variables": {
    "ACCESS_KEY": "YOUR_ACCESS_KEY",
    "SECRET_KEY": "YOUR_SECRET_KEY",
    "REGION": "us-east-1",
    "DYNAMODB_HOLD_TABLE": "TV-Bot-HoldTable",
    "DYNAMODB_SETTING_TABLE": "TV-Bot-SettingTable",
    "DYNAMODB_STRATEGY_TABLE": "TV-Bot-StrategyTable",
    "COINBASE_API_BASE_URL": "api.coinbase.com/api/v3/brokerage"
  }
}


Ensure you replace YOUR_ACCESS_KEY and YOUR_SECRET_KEY with your actual AWS credentials. This configuration is required for deployment to AWS Lambda.

## Deployment

### Build and Deploy
1. *Build the Project*
    yarn build
    
2. *Deploy to AWS Lambda*
    Instructions coming soon. The scripts are in the repo for windows command prompt
    

## Usage

### Setting Up Alerts on Trading View
To set up an alert on Trading View, use the following example message:

strategy_name:V2-RSI-BB-Pyramid-v5,strategy_params:(84, 12, close, 12, 200, hlc3, 3, 2, 3, 1, 8, 2023, 6, 9, 2023),order_action:{{strategy.order.action}},contracts:{{strategy.order.contracts}},ticker:{{ticker}},position_size:{{strategy.position_size}}


### Webhook URL
Configure the webhook URL in the Trading View alert settings to:

https://[insert api identifier here].execute-api.us-east-1.amazonaws.com/[insert stage here]/webhook


## Testing

### Run Tests
To run all tests, execute:
yarn test


### Run a Single Test
To run a specific test, such as test/spotSignalProcessing.buy.integration.test.ts, execute:
sh
yarn test:single test/spotSignalProcessing.buy.integration.test.ts

This command runs the tests in single-threaded mode, which is useful for debugging and ensuring isolated test execution.

## Scripts Overview

### AWS Setup and Deployment Scripts
- *attach_policies:win:dev*: Attaches policies for the development environment.
- *create_policies:win:dev*: Creates policies for the development environment.
- *create_endpoint:win:dev*: Creates the API endpoint for the development environment.
- *create_new_policy_versions:win:dev*: Creates new policy versions.
- *create_tables:win:dev/stage/prod*: Creates DynamoDB tables for the specified environment.
- *create_role:win:dev*: Creates IAM roles for the development environment.
- *delete_old_policy_versions:win:dev*: Deletes old policy versions.
- *delete_lambda:win:dev*: Deletes the Lambda function for the development environment.
- *deploy:win:dev/stage/prod*: Packages and deploys the Lambda function for the specified environment.
- *setup_apikey:win:dev*: Sets up the API key for the development environment.
- *update_function:win:dev/stage/prod*: Updates the Lambda function for the specified environment.
- *update_api:win:dev*: Updates the API for the development environment.
- *update_env:win:dev/stage/prod*: Updates environment variables for the specified environment.

### Other Scripts
- *copy:package*: Copies package.json and yarn.lock to the dist directory.
- *start*: Uses tsc-watch to compile TypeScript files and starts the Serverless Offline environment. tsc-watch watches for changes in TypeScript files and re-compiles them when changes are detected, then runs serverless offline to simulate the AWS Lambda environment locally.
- *clean*: Removes the dist directory to clean up previous builds.
- *prebuild*: Runs yarn clean to ensure a clean build environment.
- *build*: Uses TypeScript compiler (tsc) to compile the TypeScript files.
- *deploy*: Deploys the project using AWS CDK.
- *postbuild*: Copies package files to the dist directory and installs production dependencies there.
- *test*: Runs all tests using jest.
- *test:single*: Runs tests in single-threaded mode using jest.

## License
tw-lambda-bot is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Author
Evan McCall - [e.mccallvr@gmail.com](mailto:e.mccallvr@gmail.com)