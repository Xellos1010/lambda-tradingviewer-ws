import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { logMessage } from '../../../aws-deployment-scripts/utils/logger';
import { BaseCommandExecution } from '../BaseCommandExecution';

export abstract class AttachPoliciesBase extends BaseCommandExecution {
    protected SCRIPT_DIR_ATTACH_POLICIES = __dirname;
    protected AWS_PROFILE: string;
    protected LOG_FILE: string;
    protected POLICIES_FOLDER: string;
    protected ROLE_NAME: string;
    protected ACCOUNT_ID: string;

    constructor(AWS_PROFILE: string, LOG_FILE: string, ROLE_NAME: string, ACCOUNT_ID: string) {
        super();
        this.AWS_PROFILE = AWS_PROFILE;
        this.LOG_FILE = LOG_FILE;
        this.ROLE_NAME = ROLE_NAME;
        this.ACCOUNT_ID = ACCOUNT_ID;
        this.POLICIES_FOLDER = join(this.SCRIPT_DIR_ATTACH_POLICIES, 'policies');
    }

    public attachPolicies() {
        // Ensure the policies folder exists
        if (!existsSync(this.POLICIES_FOLDER)) {
            const errorMessage = `${this.POLICIES_FOLDER} folder does not exist. Please create and populate with policy json files for AWS CLI`;
            logMessage(this.LOG_FILE, errorMessage);
            throw new Error(errorMessage);
        }

        logMessage(this.LOG_FILE, 'Attaching Policies...');

        const policyFiles = readdirSync(this.POLICIES_FOLDER).filter(file => file.endsWith('.json'));

        policyFiles.forEach(file => {
            const policyName = file.replace('.json', '');
            const command = `aws iam attach-role-policy --role-name ${this.ROLE_NAME} --policy-arn arn:aws:iam::${this.ACCOUNT_ID}:policy/${policyName} --profile ${this.AWS_PROFILE}`;
            this.executeCommandWithLogging(command, this.LOG_FILE);
        });

        logMessage(this.LOG_FILE, 'Policies Attached.');
    }
}
