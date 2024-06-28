// setup-deployment/aws-setup-scripts/DEV/create_tables-dev.ts
import { join } from 'path';
import { CreateTableBase } from '../base/tables/CreateTableBase';
import { execSync } from 'child_process';
import { logMessage } from '../../aws-deployment-scripts/utils/logger';

export class CreateTablesDEV extends CreateTableBase {
    constructor(AWS_PROFILE: string, LOG_FILE: string) {
        const TABLES_FOLDER = join(__dirname, 'tables');
        super(AWS_PROFILE, LOG_FILE, TABLES_FOLDER);
    }

    public setupAndCreateTables() {
        // Call the base class's createTables method
        this.createTables();
    }

    protected executeCreateTableCommands(tableFiles: string[], logFilePath: string) {
        // Implementation of the table creation commands for DEV
        tableFiles.forEach(file => {
            const command = `aws dynamodb create-table --cli-input-json file://${join(this.TABLES_FOLDER, file)} --profile ${this.AWS_PROFILE}`;
            logMessage(logFilePath, `Executing command: ${command}`);
            try {
                const stdout = execSync(command, { stdio: 'pipe' }).toString();
                logMessage(logFilePath, `Successfully executed command: ${command}\nOutput: ${stdout}`);
            } catch (error) {
                if (error instanceof Error) {
                    const stderr = (error as any).stderr?.toString() || '';
                    const errorMessage = `Error executing command: ${command} - ${stderr || error.message}`;
                    logMessage(logFilePath, errorMessage);
                    console.error(errorMessage);
                } else {
                    const genericErrorMessage = `Error executing command: ${command} - ${error}`;
                    logMessage(logFilePath, genericErrorMessage);
                    console.error(genericErrorMessage);
                }
            }
        });
    }
}
