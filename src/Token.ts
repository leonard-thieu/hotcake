import { TokenKind } from "./TokenKind";

export class Token {
    constructor(
        public kind: TokenKind,
        public fullStart: number,
        public start: number,
        public length: number) { }

    getFullText(module: string): string {
        return module.slice(this.fullStart, this.fullStart + this.length);
    }

    toJSON(): any {
        return {
            kind: TokenKind[this.kind],
            fullStart: this.fullStart,
            start: this.start,
            length: this.length,
        };
    }
}
