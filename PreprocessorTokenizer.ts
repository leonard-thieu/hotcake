import { PreprocessorToken, PreprocessorTokenKind } from "./PreprocessorToken";

function isWhitespace(c: string | null): boolean {
    switch (c) {
        case '\x00':
        case '\x01':
        case '\x02':
        case '\x03':
        case '\x04':
        case '\x05':
        case '\x06':
        case '\x07':
        case '\x08':
        case '\x09':
        // Excludes line feed.
        case '\x0B':
        case '\x0C':
        case '\x0D':
        case '\x0E':
        case '\x0F':
        case '\x10':
        case '\x11':
        case '\x12':
        case '\x13':
        case '\x14':
        case '\x15':
        case '\x16':
        case '\x17':
        case '\x18':
        case '\x19':
        case '\x1A':
        case '\x1B':
        case '\x1C':
        case '\x1D':
        case '\x1E':
        case '\x1F':
        case '\x20':
            return true;
    }

    return false;
}

export class PreprocessorTokenizer {
    constructor(private readonly input: string) { }

    private position: number = -1;

    next(): PreprocessorToken {
        let c = this.nextChar();

        let kind = PreprocessorTokenKind.Unknown;
        const start = this.position;
        let length = 1;

        switch (c) {
            case null:
                kind = PreprocessorTokenKind.EOF;
                length = 0;
                break;
            case '\n':
                kind = PreprocessorTokenKind.Newline;
                break;
            case "'":
                kind = PreprocessorTokenKind.Comment

                while (true) {
                    c = this.peekChar();
                    if (c === '\n' ||
                        c === null) {
                        break;
                    }
                    this.position++;
                    length++;
                }
                break;
            // TODO: Should escape characters be handled?
            case '"':
                kind = PreprocessorTokenKind.StringLiteral

                while (true) {
                    c = this.nextChar();
                    length++;
                    if (c === '"') {
                        break;
                    }
                }
                break;
            default:
                if (isWhitespace(c)) {
                    kind = PreprocessorTokenKind.Whitespace;

                    while (true) {
                        c = this.peekChar();
                        if (!isWhitespace(c)) {
                            break;
                        }
                        this.position++;
                        length++;
                    }
                }
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
