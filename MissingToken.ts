import { Token, TokenKind } from "./Token";

export class MissingToken extends Token {
    constructor(kind: TokenKind, start: number) {
        super(kind, start, 0);
    }
}