import { EnvironmentConfig, validateEnvironment } from '../Environment';
import { StageConfig } from './types/StageConfig';

let stageConfig: StageConfig | null = null;
let isInitialized = false;

export const setupStageConfig = (
    stage: string,
    logFilePath: string
): void => {
    if (isInitialized) {
        throw new Error("StageConfig is already initialized.");
    }

    const envConfig: EnvironmentConfig = validateEnvironment();

    const baseConfig = {
        ACCOUNT_ID: envConfig.ACCOUNT_ID,
        HANDLER: 'index.handler',
        REGION: process.env.AWS_REGION || 'us-east-1',
        RUNTIME: 'nodejs20.x',
    };

    const ENV = stage.toUpperCase();
    const FUNCTION_NAME = `${envConfig.FUNCTION_NAME}-${ENV}`;
    const ROLE_NAME = `${FUNCTION_NAME}LambdaExecutionRole-${ENV}`;
    const ZIP_FILE = `lambda_function-${ENV}.zip`;

    stageConfig = {
        ...baseConfig,
        STAGE: stage,
        ENV,
        LOGS_DIR: process.cwd(),
        LOG_FILE: logFilePath,
        LOGGER_PATH: '', // Add the actual path if needed
        ENV_SET: true,
        FUNCTION_DESCRIPTION: envConfig.FUNCTION_DESCRIPTION,
        FUNCTION_NAME,
        ZIP_FILE,
        ROLE_NAME,
        ROLE_ARN: `arn:aws:iam::${envConfig.ACCOUNT_ID}:role/${ROLE_NAME}`,
        LOG_GROUP_NAME: `/aws/lambda/${FUNCTION_NAME}`,
        REST_API_ID: envConfig.REST_API_ID,
        RESOURCE_ID: envConfig.RESOURCE_ID, // Optional
        HTTP_METHOD: envConfig.HTTP_METHOD,
        ENDPOINT_NAME: envConfig.ENDPOINT_NAME,
        CHANGE_DIR_UTIL_PATH: '', // Add the actual path if needed
    };

    isInitialized = true;
};

export const getStageConfig = (): StageConfig => {
    if (!stageConfig) {
        throw new Error("StageConfig is not set up. Please call setupStageConfig first.");
    }
    return stageConfig;
};
