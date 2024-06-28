export type StageConfig = {
    AWS_PROFILE?:string, //TODO: Add hard requirement for aws profile
    STAGE: string;
    ENV: string;
    LOGS_DIR: string;
    LOG_FILE: string;
    LOGGER_PATH: string;
    ENV_SET: boolean;
    FUNCTION_DESCRIPTION: string;
    FUNCTION_NAME: string;
    ZIP_FILE: string;
    RUNTIME: string;
    ROLE_NAME: string;
    ACCOUNT_ID: string;
    ROLE_ARN: string;
    HANDLER: string;
    LOG_GROUP_NAME: string;
    REST_API_ID: string;
    RESOURCE_ID?: string;
    HTTP_METHOD: string;
    ENDPOINT_NAME: string;
    REGION: string;
    CHANGE_DIR_UTIL_PATH: string;
};
