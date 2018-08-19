import { Token } from './Token';

export class SkippedToken extends Token {
    constructor(token: Token) {
        super(token.kind, token.start, token.length);
    }
}