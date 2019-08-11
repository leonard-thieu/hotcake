import { EqualsSignToken, ShrKeywordToken, Token, TokenKind } from './Tokens';

export class ShrKeywordEqualsSignToken extends Token<TokenKind.ShrKeywordEqualsSign> {
    constructor(
        public shrKeyword: ShrKeywordToken,
        public equalsSign: EqualsSignToken,
    ) {
        super(
            TokenKind.ShrKeywordEqualsSign,
            shrKeyword.fullStart,
            shrKeyword.start,
            shrKeyword.length + equalsSign.length,
        );
    }
}
