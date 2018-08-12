import { PreprocessorToken, PreprocessorTokenKind } from "./PreprocessorToken";

export class PreprocessorTokenizer {
    constructor(private readonly input: string) { }

    private position: number = -1;

    next(): PreprocessorToken {
        let c = this.nextChar();

        switch (c) {
            case null:
                return new PreprocessorToken(PreprocessorTokenKind.EOF, this.position, 0);
        }

        return new PreprocessorToken(PreprocessorTokenKind.Unknown, this.position, 1);
    }

    private nextChar(): string | null {
        if (this.position + 1 >= this.input.length) {
            return null;
        }

        this.position++;

        return this.input[this.position];
    }
}
