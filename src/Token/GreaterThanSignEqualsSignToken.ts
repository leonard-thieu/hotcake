import { EqualsSignToken, GreaterThanSignToken, Token } from './Token';
import { TokenKind } from './TokenKind';

export class GreaterThanSignEqualsSignToken extends Token {
    constructor(public greaterThanSign: GreaterThanSignToken, public equalsSign: EqualsSignToken) {
        super(
            TokenKind.GreaterThanSignEqualsSign,
            greaterThanSign.fullStart,
            greaterThanSign.start,
            greaterThanSign.length + equalsSign.length
        );
    }

    kind: TokenKind.GreaterThanSignEqualsSign;

    toJSON(): any {
        return Object.assign({}, this, {
            greaterThanSign: this.greaterThanSign,
            equalsSign: this.equalsSign,
        });
    }
}
