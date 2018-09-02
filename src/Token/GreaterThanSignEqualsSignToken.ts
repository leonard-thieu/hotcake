import { EqualsSignToken, GreaterThanSignToken, Token } from './Token';
import { TokenKind } from './TokenKind';

export class GreaterThanSignEqualsSignToken extends Token<TokenKind.GreaterThanSignEqualsSign> {
    constructor(public greaterThanSign: GreaterThanSignToken, public equalsSign: EqualsSignToken) {
        super(
            TokenKind.GreaterThanSignEqualsSign,
            greaterThanSign.fullStart,
            greaterThanSign.start,
            greaterThanSign.length + equalsSign.length
        );
    }

    toJSON(): any {
        return Object.assign({}, this, {
            greaterThanSign: this.greaterThanSign,
            equalsSign: this.equalsSign,
        });
    }
}
