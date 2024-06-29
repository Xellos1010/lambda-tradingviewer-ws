import { CreatePoliciesBase } from '../base/policies/CreatePoliciesBase';

export class CreatePoliciesDEV extends CreatePoliciesBase {
    constructor(AWS_PROFILE: string, LOG_FILE: string) {
        super(AWS_PROFILE, LOG_FILE);
    }
}
