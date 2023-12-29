export class ExpiredConfirmationCodeException extends Error {
    constructor() {
        super("Expired confirmation code");
    }
}