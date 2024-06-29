import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { logMessage } from '../../../aws-deployment-scripts/utils/logger';
import { BaseCommandExecution } from '../BaseCommandExecution';

export abstract class CreatePoliciesBase extends BaseCommandExecution {
    protected SCRIPT_DIR_CREATE_POLICIES = __dirname;
    protected AWS_PROFILE: string;
    protected LOG_FILE: string;
    protected POLICIES_FOLDER: string;

    constructor(AWS_PROFILE: string, LOG_FILE: string) {
        super();
        this.AWS_PROFILE = AWS_PROFILE;
        this.LOG_FILE = LOG_FILE;
        this.POLICIES_FOLDER = join(this.SCRIPT_DIR_CREATE_POLICIES, 'policies');
    }

    public createPolicies() {
        // Ensure the policies folder exists
        if (!existsSync(this.POLICIES_FOLDER)) {
            const errorMessage = `${this.POLICIES_FOLDER} folder does not exist. Please create and populate with policy json files for AWS CLI`;
            logMessage(this.LOG_FILE, errorMessage);
            throw new Error(errorMessage);
        }

        logMessage(this.LOG_FILE, 'Creating Policies...');
        
        const policyFiles = readdirSync(this.POLICIES_FOLDER).filter(file => file.endsWith('.json'));

        policyFiles.forEach(file => {
            const policyName = file.replace('.json', '');
            const policyDocumentPath = join(this.POLICIES_FOLDER, file);
            const command = `aws iam create-policy --policy-name ${policyName} --policy-document file://${policyDocumentPath} --profile ${this.AWS_PROFILE}`;
            this.executeCommandWithLogging(command, this.LOG_FILE);
        });

        logMessage(this.LOG_FILE, 'Policies Created.');
    }
}
