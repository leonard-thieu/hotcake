import { EqualsSignToken, ShrKeywordToken, Token } from './Token';
import { TokenKind } from './TokenKind';

export class ShrKeywordEqualsSignToken extends Token<TokenKind.ShrKeywordEqualsSign> {
    constructor(public shrKeyword: ShrKeywordToken, public equalsSign: EqualsSignToken) {
        super(
            TokenKind.ShrKeywordEqualsSign,
            shrKeyword.fullStart,
            shrKeyword.start,
            shrKeyword.length + equalsSign.length
        );
    }

    toJSON(): any {
        return Object.assign({}, this, {
            shrKeyword: this.shrKeyword,
            equalsSign: this.equalsSign,
        });
    }
}
