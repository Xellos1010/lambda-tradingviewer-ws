// setup-deployment/aws-deployment-scripts/DEV/package-deploy-dev.ts
import { deployBasePackage } from '../package-deploy-base';
import { setupStageConfig } from '../utils/StageConfig';
import { logMessage, setupLogFile } from '../utils/logger';

// Define the stage
const stage = 'dev';

// Initialize configuration
const LOG_FILE_PATH = `${process.cwd()}/debug-deploy-${stage.toUpperCase()}.log`;
setupStageConfig(stage, LOG_FILE_PATH);
setupLogFile(LOG_FILE_PATH);

logMessage(LOG_FILE_PATH, 'Executing Base Operation');

// Run the base script
deployBasePackage();

logMessage(LOG_FILE_PATH, 'Script execution completed.');
