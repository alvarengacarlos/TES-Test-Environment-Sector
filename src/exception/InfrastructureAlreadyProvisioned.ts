export class InfrastructureAlreadyProvisioned extends Error {
    constructor() {
        super("Infrastructure already provisioned");
    }
}