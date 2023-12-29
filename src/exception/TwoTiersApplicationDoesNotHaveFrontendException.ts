export class TwoTiersApplicationDoesNotHaveFrontendException extends Error {
    constructor() {
        super("Two tiers application does not have frontend");
    }
}