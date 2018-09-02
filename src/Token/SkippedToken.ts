import { Token, TokenKinds } from './Token';

export class SkippedToken<TTokenKind extends TokenKinds> extends Token<TTokenKind> {
    constructor(token: Token<TTokenKind>) {
        super(token.kind, token.fullStart, token.start, token.length);
    }

    toJSON(): any {
        return Object.assign({
            type: this.constructor.name,
        }, this);
    }
}
