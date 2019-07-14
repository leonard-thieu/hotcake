import { EqualsSignToken, ShlKeywordToken, Token } from './Token';
import { TokenKind } from './TokenKind';

export class ShlKeywordEqualsSignToken extends Token<TokenKind.ShlKeywordEqualsSign> {
    constructor(public shlKeyword: ShlKeywordToken, public equalsSign: EqualsSignToken) {
        super(
            TokenKind.ShlKeywordEqualsSign,
            shlKeyword.fullStart,
            shlKeyword.start,
            shlKeyword.length + equalsSign.length
        );
    }

    toJSON(): any {
        return Object.assign({}, this, {
            shlKeyword: this.shlKeyword,
            equalsSign: this.equalsSign,
        });
    }
}
