export class InfrastructureAlreadyProvisionedException extends Error {
    constructor() {
        super("Infrastructure already provisioned");
    }
}