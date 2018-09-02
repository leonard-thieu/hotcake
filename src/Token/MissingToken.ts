import { NewlineToken, Token, TokenKinds } from './Token';

export class MissingToken extends Token {
    constructor(kind: TokenKinds, fullStart: number) {
        super(kind, fullStart, fullStart, 0);
    }

    newlines: NewlineToken[] | null = null;

    toJSON(): any {
        return Object.assign({
            type: this.constructor.name,
        }, this);
    }
}
