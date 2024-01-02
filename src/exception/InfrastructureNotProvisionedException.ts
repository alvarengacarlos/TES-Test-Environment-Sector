export class InfrastructureNotProvisionedException extends Error {
    constructor() {
        super("Infrastructure not provisioned");
    }
}