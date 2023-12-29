export class DeployModelDoesNotExistException extends Error {
    constructor() {
        super("Deploy model does not exist")
    }
}