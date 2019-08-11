import { EqualsSignToken, GreaterThanSignToken, Token, TokenKind } from './Tokens';

export class GreaterThanSignEqualsSignToken extends Token<TokenKind.GreaterThanSignEqualsSign> {
    constructor(
        public greaterThanSign: GreaterThanSignToken,
        public equalsSign: EqualsSignToken,
    ) {
        super(
            TokenKind.GreaterThanSignEqualsSign,
            greaterThanSign.fullStart,
            greaterThanSign.start,
            greaterThanSign.length + equalsSign.length,
        );
    }
}
