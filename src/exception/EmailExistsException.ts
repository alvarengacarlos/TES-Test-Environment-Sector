export class EmailExistsException extends Error {
    constructor() {
        super("Email exists")
    }
}
