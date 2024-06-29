import { CreateRolesBase } from '../base/roles/CreateRolesBase';
import { AttachPoliciesDEV } from './AttachPoliciesDEV';
import { CreatePoliciesDEV } from './CreatePoliciesDEV';

export class CreateRolesDEV extends CreateRolesBase {
    constructor(AWS_PROFILE: string, LOG_FILE: string, ROLE_NAME: string, STAGE: string, ENV: string, ACCOUNT_ID: string) {
        super(AWS_PROFILE, LOG_FILE, ROLE_NAME, STAGE, ENV, ACCOUNT_ID);
    }

    protected createAdditionalPolicies() {
        const createPoliciesDEV = new CreatePoliciesDEV(this.AWS_PROFILE, this.LOG_FILE);
        createPoliciesDEV.createPolicies();
    }

    protected attachAdditionalPolicies() {
        const attachPoliciesDEV = new AttachPoliciesDEV(this.AWS_PROFILE, this.LOG_FILE, this.ROLE_NAME, this.ACCOUNT_ID);
        attachPoliciesDEV.attachPolicies();
    }
}
