// setup-deployment/aws-setup-scripts/DEV/create_tables-dev.ts
import { join } from 'path';
import { CreateTableBase } from '../base/tables/CreateTableBase';

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
            this.executeCommandWithLogging(command, logFilePath);
        });
    }
}
