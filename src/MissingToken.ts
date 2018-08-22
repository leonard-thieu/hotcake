import { Token, TokenKind } from './Token';

export class MissingToken extends Token {
    constructor(kind: TokenKind, fullStart: number) {
        super(kind, fullStart, fullStart, 0);
    }
}