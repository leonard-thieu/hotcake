import { TokenKind } from "./TokenKind";

export class Token {
    constructor(
        public kind: TokenKind,
        public fullStart: number,
        public start: number,
        public length: number) { }

    toJSON(): any {
        return {
            kind: TokenKind[this.kind],
            fullStart: this.fullStart,
            start: this.start,
            length: this.length,
        };
    }
}
