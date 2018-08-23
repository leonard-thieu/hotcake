import { Token } from './Token';
import { TokenKind } from "./TokenKind";

export class MissingToken extends Token {
    constructor(kind: TokenKind, fullStart: number) {
        super(kind, fullStart, fullStart, 0);
    }

    toJSON(): any {
        return {
            type: this.constructor.name,
            ...super.toJSON(),
        };
    }
}
