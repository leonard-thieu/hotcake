import { Token } from "./Token";
import { TokenKind } from "./TokenKind";

export class GreaterThanSignEqualsSignToken extends Token {
    constructor(public greaterThanSign: Token, public equalsSign: Token) {
        super(
            TokenKind.GreaterThanSignEqualsSign,
            greaterThanSign.fullStart,
            greaterThanSign.start,
            greaterThanSign.length + equalsSign.length
        );
    }

    toJSON(): any {
        return {
            ...super.toJSON(),
            greaterThanSign: this.greaterThanSign,
            equalsSign: this.equalsSign,
        };
    }
}
