import { PreprocessorToken, PreprocessorTokenKind } from "./PreprocessorToken";

export class PreprocessorTokenizer {
    constructor(private readonly input: string) { }

    private position: number = -1;

    next(): PreprocessorToken {
        let c = this.nextChar();

        let kind = PreprocessorTokenKind.Unknown;
        const start = this.position;
        let length = 1;

        switch (c) {
            case '\n':
                kind = PreprocessorTokenKind.Newline;
                break;
            case null:
                kind = PreprocessorTokenKind.EOF;
                length = 0;
                break;
        }

        return new PreprocessorToken(kind, start, length);
    }

    private nextChar(): string | null {
        const c = this.peekChar();
        
        if (c !== null) {
            this.position++;
        }

        return c;
    }

    private peekChar(offset: number = 1): string | null {
        const nextPosition = this.position + offset;

        if (nextPosition >= this.input.length) {
            return null;
        }

        return this.input[nextPosition];
    }
}
