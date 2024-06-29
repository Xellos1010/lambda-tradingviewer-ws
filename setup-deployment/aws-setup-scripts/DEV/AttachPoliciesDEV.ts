import { AttachPoliciesBase } from '../base/policies/AttachPoliciesBase';

export class AttachPoliciesDEV extends AttachPoliciesBase {
    constructor(AWS_PROFILE: string, LOG_FILE: string, ROLE_NAME: string, ACCOUNT_ID: string) {
        super(AWS_PROFILE, LOG_FILE, ROLE_NAME, ACCOUNT_ID);
    }
}
