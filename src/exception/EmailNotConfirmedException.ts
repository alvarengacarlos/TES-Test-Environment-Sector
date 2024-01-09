export class EmailNotConfirmedException extends Error {
    constructor() {
        super("Email not confirmed")
    }
}
