import { Token, TokenKinds } from './Token';
import { TokenKind } from './TokenKind';

export class SkippedToken<TTokenKind extends TokenKinds> extends Token<TokenKind.Skipped> {
    constructor(token: Token<TTokenKind>) {
        super(TokenKind.Skipped, token.fullStart, token.start, token.length);

        this.originalKind = token.kind;
    }

    originalKind: TTokenKind;
}
