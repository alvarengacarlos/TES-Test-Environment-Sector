export class IncorrectEmailOrPasswordException extends Error {
    constructor() {
        super("Incorrect email or password");
    }
}