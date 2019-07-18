import { Token, Tokens } from './Token';
import { TokenKind } from './TokenKind';

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
