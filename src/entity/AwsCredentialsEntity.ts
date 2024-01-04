export class AwsCredentialsEntity {
    constructor(
        public readonly accessKeyId: string,
        public readonly secretAccessKey: string,
    ) {
    }
}