export class AwsCredentialsDoesNotExistException extends Error {
    constructor() {
        super("Aws credentials does not exist");
    }
}