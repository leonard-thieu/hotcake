import { TokenKind } from "./TokenKind";

export class Token {
    constructor(
        public kind: TokenKind,
        public fullStart: number,
        public start: number,
        public length: number) { }

    getFullText(document: string): string {
        return document.slice(this.fullStart, this.fullStart + this.length);
    }

    getText(document: string): string {
        return document.slice(this.start, this.fullStart + this.length);
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
