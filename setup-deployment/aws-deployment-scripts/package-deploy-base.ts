// setup-deployment/aws-deployment-scripts/package-deploy-base.ts
import { setupLogFile, logMessage } from './utils/logger';
import { getStageConfig } from './utils/StageConfig';
import { compressProjectFiles } from './utils/zip-file';
import { CreateTablesDEV } from '../aws-setup-scripts/DEV/CreateTablesDEV';
import { CreateRolesDEV } from '../aws-setup-scripts/DEV/CreateRolesDEV';

export const deployBasePackage = () => {
    // Initialize configuration
    const stageConfig = getStageConfig();
    const {
        // FUNCTION_NAME,
        // ZIP_FILE,
        ROLE_NAME,
        // RUNTIME,
        ACCOUNT_ID,
        // REGION,
        LOG_FILE,
        // ROLE_ARN,
        // HTTP_METHOD,
        ENV,
        STAGE
    } = stageConfig;

    const AWS_PROFILE = process.env.AWS_PROFILE;

    if (AWS_PROFILE === undefined) {
        throw new Error("AWS_PROFILE needs to be set in .env file to execute the operation");
    }

    setupLogFile(LOG_FILE);

    // Ensure the dist directory exists and compress project files into ZIP
    compressProjectFiles('dist'); // Pass the directory to be zipped

    // Call the script to create the tables
    logMessage(LOG_FILE, 'Calling script to create the tables');
    const createTablesDEV = new CreateTablesDEV(AWS_PROFILE, LOG_FILE);
    createTablesDEV.setupAndCreateTables();
    logMessage(LOG_FILE, 'Table Creation is Complete.');

    

    // Call the script to create the roles and assign the policies
    logMessage(LOG_FILE, 'Calling script to create roles and assign policies.');
    const createRolesDEV = new CreateRolesDEV(AWS_PROFILE, LOG_FILE, ROLE_NAME, STAGE, ENV, ACCOUNT_ID);
    createRolesDEV.createRolesAndPolicies();
    logMessage(LOG_FILE, 'Role creation and policy assignment script execution completed.');

    // // Deploy Lambda function code
    // logMessage(LOG_FILE, 'Deploying Lambda function with AWS CLI...');
    // executeCommand(`aws lambda create-function --function-name ${FUNCTION_NAME} --runtime ${RUNTIME} --role ${ROLE_ARN} --handler index.handler --zip-file fileb://${ZIP_FILE} --profile ${AWS_PROFILE}`, LOG_FILE);
    // logMessage(LOG_FILE, 'Lambda function deployment completed.');

    // // Publish new version and update alias
    // logMessage(LOG_FILE, 'Publishing new version and updating alias...');
    // let version;
    // try {
    //     version = execSync(`aws lambda publish-version --function-name ${FUNCTION_NAME} --query Version --output text --profile ${AWS_PROFILE}`).toString().trim();
    //     logMessage(LOG_FILE, `Version published: ${version}`);
    // } catch (error) {
    //     logMessage(LOG_FILE, `Error publishing new version: ${error}`);
    //     console.error('Error publishing new version:', error);
    //     process.exit(1);
    // }

    // if (version) {
    //     logMessage(LOG_FILE, 'Creating or updating alias...');
    //     try {
    //         executeCommand(`aws lambda create-alias --function-name ${FUNCTION_NAME} --name ${stageConfig.ENV} --function-version ${version} --profile ${AWS_PROFILE}`, LOG_FILE);
    //     } catch (error) {
    //         executeCommand(`aws lambda update-alias --function-name ${FUNCTION_NAME} --name ${stageConfig.ENV} --function-version ${version} --profile ${AWS_PROFILE}`, LOG_FILE);
    //     }
    // }

    // // Create the Logs for the Function
    // logMessage(LOG_FILE, 'Creating log group for the Lambda function...');
    // executeCommand(`aws logs create-log-group --log-group-name /aws/lambda/${FUNCTION_NAME} --profile ${AWS_PROFILE}`, LOG_FILE);
    // logMessage(LOG_FILE, 'Log group creation completed.');

    // // Call the script to update the configuration
    // logMessage(LOG_FILE, 'Updating environment configuration with provided script...');
    // executeCommand(`ts-node aws-setup-scripts/${stageConfig.ENV}/update_env-${stageConfig.STAGE}.ts`, LOG_FILE);
    // logMessage(LOG_FILE, 'Environment configuration update script execution completed.');

    // // Get the ARN of the newly created Lambda function
    // logMessage(LOG_FILE, 'Retrieving ARN of the newly created Lambda function...');
    // let functionArn;
    // try {
    //     functionArn = execSync(`aws lambda get-function --function-name ${FUNCTION_NAME} --profile ${AWS_PROFILE} --query Configuration.FunctionArn --output text`).toString().trim();
    //     logMessage(LOG_FILE, `ARN retrieved: ${functionArn}`);
    // } catch (error) {
    //     logMessage(LOG_FILE, `ARN not retrieved, check logs for details: ${error}`);
    //     console.error('ARN not retrieved, check logs for details:', error);
    // }

    // // Update API
    // logMessage(LOG_FILE, 'Updating API.');
    // executeCommand(`ts-node aws-setup-scripts/${stageConfig.ENV}/update-api-${stageConfig.STAGE}.ts`, LOG_FILE);

    // logMessage(LOG_FILE, 'Base Package Deploy Script execution completed.');
};
