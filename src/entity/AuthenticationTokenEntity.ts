export class AuthenticationTokenEntity {
    constructor(
        public readonly identityToken: string,
        public readonly identityTokenType: string,
        public readonly refreshToken: string
    ) {
    }
}