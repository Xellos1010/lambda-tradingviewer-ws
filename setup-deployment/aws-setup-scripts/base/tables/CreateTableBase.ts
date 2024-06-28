import { existsSync, readdirSync } from 'fs';
import { logMessage, logErrorAndThrow } from '../../../aws-deployment-scripts/utils/logger';

export abstract class CreateTableBase {
    protected CALLINGDIRECTORY_CREATE_TABLES = process.cwd();
    protected SCRIPT_DIR_CREATE_TABLE = __dirname;
    protected AWS_PROFILE: string;
    protected LOG_FILE: string;
    protected TABLES_FOLDER: string;

    constructor(AWS_PROFILE: string, LOG_FILE: string, TABLES_FOLDER: string) {
        this.AWS_PROFILE = AWS_PROFILE;
        this.LOG_FILE = LOG_FILE;
        this.TABLES_FOLDER = TABLES_FOLDER;
    }
    public createTables() {
        // Ensure the directory exists
        if (!existsSync(this.TABLES_FOLDER)) {
            logErrorAndThrow(this.LOG_FILE, `${this.TABLES_FOLDER} folder does not exist. Please create and populate with table creation json files for aws cli`);
        }

        // Iterate through each .json file in the folder and execute the create table commands
        const tableFiles = readdirSync(this.TABLES_FOLDER).filter(file => file.endsWith('.json'));

        if (tableFiles.length === 0) {
            logErrorAndThrow(this.LOG_FILE, `No table definition files found in the tables folder. Please populate ${this.TABLES_FOLDER} with table creation json files for aws cli`);
        }

        this.executeCreateTableCommands(tableFiles, this.LOG_FILE);

        logMessage(this.LOG_FILE, 'Script execution completed.');
    }

    protected abstract executeCreateTableCommands(tableFiles: string[], logFilePath: string): void;
}
