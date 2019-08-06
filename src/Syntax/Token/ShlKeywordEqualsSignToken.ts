import { EqualsSignToken, ShlKeywordToken, Token, TokenKind } from './Tokens';

export class ShlKeywordEqualsSignToken extends Token<TokenKind.ShlKeywordEqualsSign> {
    constructor(
        public shlKeyword: ShlKeywordToken,
        public equalsSign: EqualsSignToken,
    ) {
        super(
            TokenKind.ShlKeywordEqualsSign,
            shlKeyword.fullStart,
            shlKeyword.start,
            shlKeyword.length + equalsSign.length,
        );
    }
}
