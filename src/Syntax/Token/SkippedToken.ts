import { Token, TokenKind, Tokens } from './Tokens';

export class SkippedToken extends Token<TokenKind.Skipped> {
    constructor(readonly originalToken: Tokens) {
        super(
            TokenKind.Skipped,
            originalToken.fullStart,
            originalToken.start,
            originalToken.length,
        );
    }
}
