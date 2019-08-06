import { EqualsSignToken, ModKeywordToken, Token, TokenKind } from './Tokens';

export class ModKeywordEqualsSignToken extends Token<TokenKind.ModKeywordEqualsSign> {
    constructor(
        public modKeyword: ModKeywordToken,
        public equalsSign: EqualsSignToken,
    ) {
        super(
            TokenKind.ModKeywordEqualsSign,
            modKeyword.fullStart,
            modKeyword.start,
            modKeyword.length + equalsSign.length,
        );
    }
}
