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

function isBinary(c: string | null): boolean {
    switch (c) {
        case '0':
        case '1':
            return true;
    }

    return false;
}

function isDecimal(c: string | null): boolean {
    switch (c) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            return true;
    }

    return false;
}

function isHexadecimal(c: string | null): boolean {
    switch (c) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case 'A':
        case 'B':
        case 'C':
        case 'D':
        case 'E':
        case 'F':
        case 'a':
        case 'b':
        case 'c':
        case 'd':
        case 'e':
        case 'f':
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

        switch (c) {
            case null: {
                kind = PreprocessorTokenKind.EOF;
                break;
            }
            case '\n': {
                kind = PreprocessorTokenKind.Newline;
                break;
            }
            case "'": {
                kind = PreprocessorTokenKind.Comment

                while ((c = this.peekChar()) !== null) {
                    if (c === '\n') {
                        break;
                    }
                    this.position++;
                }
                break;
            }
            // TODO: Should escape characters be handled?
            // TODO: What should happen if the closing '"' can't be found?
            case '"': {
                kind = PreprocessorTokenKind.StringLiteral

                while (this.nextChar() !== '"') {
                    
                }
                break;
            }
            case '%': {
                if (!isBinary(this.peekChar())) {
                    break;
                }

                this.position++;
                kind = PreprocessorTokenKind.IntegerLiteral;

                while (isBinary(this.peekChar())) {
                    this.position++;
                }
                break;
            }
            case '$': {
                if (!isHexadecimal(this.peekChar())) {
                    break;
                }

                this.position++;
                kind = PreprocessorTokenKind.IntegerLiteral;

                while (isHexadecimal(this.peekChar())) {
                    this.position++;
                }
                break;
            }
            default: {
                if (isWhitespace(c)) {
                    kind = PreprocessorTokenKind.Whitespace;

                    while (isWhitespace(this.peekChar())) {
                        this.position++;
                    }
                } else if (isDecimal(c) ||
                           (c === '.' && isDecimal(this.peekChar()))) {
                    kind = PreprocessorTokenKind.IntegerLiteral;

                    if (c === '.') {
                        kind = PreprocessorTokenKind.FloatLiteral;
                    }

                    while (isDecimal(this.peekChar())) {
                        this.position++;
                    }

                    if (kind === PreprocessorTokenKind.IntegerLiteral &&
                        this.peekChar() === '.' &&
                        isDecimal(this.peekChar(2))) {
                        kind = PreprocessorTokenKind.FloatLiteral;
                        this.position++;

                        while (isDecimal(this.peekChar())) {
                            this.position++;
                        }
                    }

                    switch (this.peekChar()) {
                        case 'E':
                        case 'e': {
                            kind = PreprocessorTokenKind.FloatLiteral;
                            this.position++;

                            switch (this.peekChar()) {
                                case '+':
                                case '-': {
                                    this.position++;
                                    break;
                                }
                            }
                            
                            while (isDecimal(this.peekChar())) {
                                this.position++;
                            }
                            break;
                        }
                    }
                }
                break;
            }
        }

        const length = this.position - start + 1;

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
