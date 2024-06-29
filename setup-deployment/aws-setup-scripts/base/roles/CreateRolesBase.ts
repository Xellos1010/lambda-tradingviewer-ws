import { BaseCommandExecution } from '../BaseCommandExecution';
import { join } from 'path';

export abstract class CreateRolesBase extends BaseCommandExecution {
    protected AWS_PROFILE: string;
    protected LOG_FILE: string;
    protected ROLE_NAME: string;
    protected STAGE: string;
    protected ENV: string;
    protected ACCOUNT_ID: string;

    constructor(AWS_PROFILE: string, LOG_FILE: string, ROLE_NAME: string, STAGE: string, ENV: string, ACCOUNT_ID: string) {
        super();
        this.AWS_PROFILE = AWS_PROFILE;
        this.LOG_FILE = LOG_FILE;
        this.ROLE_NAME = ROLE_NAME;
        this.STAGE = STAGE;
        this.ENV = ENV;
        this.ACCOUNT_ID = ACCOUNT_ID;
    }

    public createRolesAndPolicies() {
        this.createRole();
        this.createAdditionalPolicies();
        this.attachAdditionalPolicies();
    }

    protected abstract createAdditionalPolicies(): void;
    protected abstract attachAdditionalPolicies(): void;

    protected createRole() {
        const assumeRolePolicyPath = join(__dirname, '../../assume-role-policy.json');
        const command = `aws iam create-role --role-name ${this.ROLE_NAME} --assume-role-policy-document file://${assumeRolePolicyPath} --profile ${this.AWS_PROFILE}`;
        this.executeCommandWithLogging(command, this.LOG_FILE);
    }
}
