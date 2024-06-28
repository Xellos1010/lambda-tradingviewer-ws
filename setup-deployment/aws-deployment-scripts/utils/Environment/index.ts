import { config } from 'dotenv';

// Load environment variables from .env file
config();

export type EnvironmentConfig = {
    FUNCTION_NAME: string;
    ACCOUNT_ID: string;
    FUNCTION_DESCRIPTION: string;
    REST_API_ID: string;
    RESOURCE_ID?: string; // Optional
    ENDPOINT_NAME: string;
    HTTP_METHOD: string;
};

export const validateEnvironment = (): EnvironmentConfig => {
    const requiredEnvVars = [
        'FUNCTION_NAME',
        'AWS_ACCOUNT_ID',
        'FUNCTION_DESCRIPTION',
        'REST_API_ID',
        'ENDPOINT_NAME',
        'HTTP_METHOD',
    ];

    const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    return {
        FUNCTION_NAME: process.env.FUNCTION_NAME as string,
        ACCOUNT_ID: process.env.AWS_ACCOUNT_ID as string,
        FUNCTION_DESCRIPTION: process.env.FUNCTION_DESCRIPTION as string,
        REST_API_ID: process.env.REST_API_ID as string,
        RESOURCE_ID: process.env.RESOURCE_ID, // Optional
        ENDPOINT_NAME: process.env.ENDPOINT_NAME as string,
        HTTP_METHOD: process.env.HTTP_METHOD as string,
    };
};
