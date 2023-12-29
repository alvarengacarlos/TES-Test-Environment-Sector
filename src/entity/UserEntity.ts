export class UserEntity {
    constructor(
        public readonly email: string,
        public readonly password: string,
    ) {
    }
}