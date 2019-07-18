import { EqualsSignToken, ModKeywordToken, Token } from './Token';
import { TokenKind } from './TokenKind';

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
