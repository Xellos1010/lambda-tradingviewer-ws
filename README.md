# tw-lambda-bot

## Overview
`tw-lambda-bot` is a Trading View Bot hosted on AWS Lambda. It is designed to automate trading strategies using signals from Trading View, and it interacts with exchanges like Coinbase and Binance. The bot is built with NodeJS and YARN.

## Table of Contents
1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Deployment](#deployment)
4. [Usage](#usage)
5. [Testing](#testing)
6. [License](#license)

## Installation

### Prerequisites
- Node.js (v20.x)
- YARN
- AWS Account

### Steps
1. **Clone the Repository**
    ```sh
    git clone https://github.com/yourusername/tw-lambda-bot.git
    cd tw-lambda-bot
    ```

2. **Install Dependencies**
    ```sh
    yarn install
    ```

## Configuration

### Environment Variables
Create a `.env` file in the root directory and populate it with the following environment variables:
```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
DYNAMODB_HOLD_TABLE=TV-Bot-HoldTable
DYNAMODB_SETTING_TABLE=TV-Bot-SettingTable
DYNAMODB_STRATEGY_TABLE=TV-Bot-StrategyTable
DYNAMODB_ORDERS_TABLE=TV-Bot-OrdersTable
COINBASE_API_BASE_URL=api.coinbase.com/api/v3/brokerage
```

## Deployment

### Build and Deploy
1. **Clean Previous Builds**
    ```sh
    yarn clean
    ```

2. **Build the Project**
    ```sh
    yarn build
    ```

3. **Deploy to AWS Lambda**
    ```sh
    cd cdk
    yarn deploy
    ```

## Usage

### Setting Up Alerts on Trading View
To set up an alert on Trading View, use the following example message:
```
strategy_name:V2-RSI-BB-Pyramid-v5,strategy_params:(84, 12, close, 12, 200, hlc3, 3, 2, 3, 1, 8, 2023, 6, 9, 2023),order_action:{{strategy.order.action}},contracts:{{strategy.order.contracts}},ticker:{{ticker}},position_size:{{strategy.position_size}}
```

### Webhook URL
Configure the webhook URL in the Trading View alert settings to:
```
https://mkgrprut87.execute-api.us-east-1.amazonaws.com/prod/webhook
```

## Testing

### Run Tests
To run the tests, execute:
```sh
yarn test
```

## License
`tw-lambda-bot` is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Author
Evan McCall - [e.mccallvr@gmail.com](mailto:e.mccallvr@gmail.com)