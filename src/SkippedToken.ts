import { Token } from './Token';

export class SkippedToken extends Token {
    constructor(token: Token) {
        super(token.kind, token.fullStart, token.start, token.length);
    }

    toJSON(): any {
        return {
            type: this.constructor.name,
            ...super.toJSON(),
        };
    }
}
