import { Token } from './Token';

export class SkippedToken extends Token {
    constructor(token: Token) {
        super(token.kind, token.fullStart, token.start, token.length);
    }

    toJSON(): any {
        const obj = super.toJSON();
        obj.type = this.constructor.name;

        return obj;
    }
}
