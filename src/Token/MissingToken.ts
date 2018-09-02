import { NewlineToken, Token, TokenKinds } from './Token';

export class MissingToken<TTokenKind extends TokenKinds> extends Token<TTokenKind> {
    constructor(kind: TTokenKind, fullStart: number) {
        super(kind, fullStart, fullStart, 0);
    }

    newlines: NewlineToken[] | null = null;

    toJSON(): any {
        return Object.assign({
            type: this.constructor.name,
        }, this);
    }
}
