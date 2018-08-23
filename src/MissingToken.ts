import { Token, TokenKind } from './Token';

export class MissingToken extends Token {
    constructor(kind: TokenKind, fullStart: number) {
        super(kind, fullStart, fullStart, 0);
    }

    toJSON(): any {
        const obj = super.toJSON();
        obj.type = this.constructor.name;

        return obj;
    }
}
