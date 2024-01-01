export class AwsCredentialsConfigurationMissingException extends Error {
    constructor() {
        super("Aws credentials configuration missing");
    }
}