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

function isAlpha(c: string | null): boolean {
    switch (c) {
        case 'A':
        case 'B':
        case 'C':
        case 'D':
        case 'E':
        case 'F':
        case 'G':
        case 'H':
        case 'I':
        case 'J':
        case 'K':
        case 'L':
        case 'M':
        case 'N':
        case 'O':
        case 'P':
        case 'Q':
        case 'R':
        case 'S':
        case 'T':
        case 'U':
        case 'V':
        case 'W':
        case 'X':
        case 'Y':
        case 'Z':
        case 'a':
        case 'b':
        case 'c':
        case 'd':
        case 'e':
        case 'f':
        case 'g':
        case 'h':
        case 'i':
        case 'j':
        case 'k':
        case 'l':
        case 'm':
        case 'n':
        case 'o':
        case 'p':
        case 'q':
        case 'r':
        case 's':
        case 't':
        case 'u':
        case 'v':
        case 'w':
        case 'x':
        case 'y':
        case 'z':
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
            case '"': {
                let keepReading = true;
                do {
                    switch (this.peekChar()) {
                        // Couldn't find a terminating '"'. Rollback.
                        case null: {
                            this.position = start;
                            keepReading = false;
                            break;
                        }
                        case '"': {
                            this.position++;
                            kind = PreprocessorTokenKind.StringLiteral
                            keepReading = false;
                            break;
                        }
                        default: {
                            this.position++;
                            break;
                        }
                    }
                } while (keepReading);
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
            case '#': {
                kind = PreprocessorTokenKind.NumberSign;
                break;
            }
            case '&': {
                kind = PreprocessorTokenKind.Ampersand;
                break;
            }
            case '(': {
                kind = PreprocessorTokenKind.OpeningParenthesis;
                break;
            }
            case ')': {
                kind = PreprocessorTokenKind.ClosingParenthesis;
                break;
            }
            case '*': {
                kind = PreprocessorTokenKind.Asterisk;
                break;
            }
            case '+': {
                kind = PreprocessorTokenKind.PlusSign;
                break;
            }
            case ',': {
                kind = PreprocessorTokenKind.Comma;
                break;
            }
            case '-': {
                kind = PreprocessorTokenKind.HyphenMinus;
                break;
            }
            case '.': {
                kind = PreprocessorTokenKind.Period;
                break;
            }
            case '/': {
                kind = PreprocessorTokenKind.Slash;
                break;
            }
            case ':': {
                kind = PreprocessorTokenKind.Colon;
                break;
            }
            case ';': {
                kind = PreprocessorTokenKind.Semicolon;
                break;
            }
            case '<': {
                kind = PreprocessorTokenKind.LessThanSign;
                break;
            }
            case '=': {
                kind = PreprocessorTokenKind.EqualsSign;
                break;
            }
            case '>': {
                kind = PreprocessorTokenKind.GreaterThanSign;
                break;
            }
            case '?': {
                kind = PreprocessorTokenKind.QuestionMark;
                break;
            }
            case '@': {
                kind = PreprocessorTokenKind.CommercialAt;
                break;
            }
            case '[': {
                kind = PreprocessorTokenKind.OpeningSquareBracket;
                break;
            }
            case ']': {
                kind = PreprocessorTokenKind.ClosingSquareBracket;
                break;
            }
            case '|': {
                kind = PreprocessorTokenKind.VerticalBar;
                break;
            }
            case '~': {
                kind = PreprocessorTokenKind.Tilde;
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
                        this.position++;
                        kind = PreprocessorTokenKind.FloatLiteral;

                        while (isDecimal(this.peekChar())) {
                            this.position++;
                        }
                    }

                    switch (this.peekChar()) {
                        case 'E':
                        case 'e': {
                            this.position++;
                            kind = PreprocessorTokenKind.FloatLiteral;

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
                } else if (c === '_' ||
                           isAlpha(c)) {
                    kind = PreprocessorTokenKind.Identifier;

                    while (true) {
                        c = this.peekChar();
                        if (c !== '_' &&
                            !isAlpha(c) &&
                            !isDecimal(c)) {
                            break;
                        }
                        this.position++;
                    }

                    switch (this.input.slice(start, this.position + 1).toLowerCase()) {
                        case 'void':
                            kind = PreprocessorTokenKind.VoidKeyword;
                            break;
                        case 'strict':
                            kind = PreprocessorTokenKind.StrictKeyword;
                            break;
                        case 'public':
                            kind = PreprocessorTokenKind.PublicKeyword;
                            break;
                        case 'private':
                            kind = PreprocessorTokenKind.PrivateKeyword;
                            break;
                        case 'protected':
                            kind = PreprocessorTokenKind.ProtectedKeyword;
                            break;
                        case 'friend':
                            kind = PreprocessorTokenKind.FriendKeyword;
                            break;
                        case 'property':
                            kind = PreprocessorTokenKind.PropertyKeyword;
                            break;
                        case 'bool':
                            kind = PreprocessorTokenKind.BoolKeyword;
                            break;
                        case 'int':
                            kind = PreprocessorTokenKind.IntKeyword;
                            break;
                        case 'float':
                            kind = PreprocessorTokenKind.FloatKeyword;
                            break;
                        case 'string':
                            kind = PreprocessorTokenKind.StringKeyword;
                            break;
                        case 'array':
                            kind = PreprocessorTokenKind.ArrayKeyword;
                            break;
                        case 'object':
                            kind = PreprocessorTokenKind.ObjectKeyword;
                            break;
                        case 'mod':
                            kind = PreprocessorTokenKind.ModKeyword;
                            break;
                        case 'continue':
                            kind = PreprocessorTokenKind.ContinueKeyword;
                            break;
                        case 'exit':
                            kind = PreprocessorTokenKind.ExitKeyword;
                            break;
                        case 'include':
                            kind = PreprocessorTokenKind.IncludeKeyword;
                            break;
                        case 'import':
                            kind = PreprocessorTokenKind.ImportKeyword;
                            break;
                        case 'module':
                            kind = PreprocessorTokenKind.ModuleKeyword;
                            break;
                        case 'extern':
                            kind = PreprocessorTokenKind.ExternKeyword;
                            break;
                        case 'new':
                            kind = PreprocessorTokenKind.NewKeyword;
                            break;
                        case 'self':
                            kind = PreprocessorTokenKind.SelfKeyword;
                            break;
                        case 'super':
                            kind = PreprocessorTokenKind.SuperKeyword;
                            break;
                        case 'eachin':
                            kind = PreprocessorTokenKind.EachInKeyword;
                            break;
                        case 'true':
                            kind = PreprocessorTokenKind.TrueKeyword;
                            break;
                        case 'false':
                            kind = PreprocessorTokenKind.FalseKeyword;
                            break;
                        case 'null':
                            kind = PreprocessorTokenKind.NullKeyword;
                            break;
                        case 'not':
                            kind = PreprocessorTokenKind.NotKeyword;
                            break;
                        case 'extends':
                            kind = PreprocessorTokenKind.ExtendsKeyword;
                            break;
                        case 'abstract':
                            kind = PreprocessorTokenKind.AbstractKeyword;
                            break;
                        case 'final':
                            kind = PreprocessorTokenKind.FinalKeyword;
                            break;
                        case 'select':
                            kind = PreprocessorTokenKind.SelectKeyword;
                            break;
                        case 'case':
                            kind = PreprocessorTokenKind.CaseKeyword;
                            break;
                        case 'default':
                            kind = PreprocessorTokenKind.DefaultKeyword;
                            break;
                        case 'const':
                            kind = PreprocessorTokenKind.ConstKeyword;
                            break;
                        case 'local':
                            kind = PreprocessorTokenKind.LocalKeyword;
                            break;
                        case 'global':
                            kind = PreprocessorTokenKind.GlobalKeyword;
                            break;
                        case 'field':
                            kind = PreprocessorTokenKind.FieldKeyword;
                            break;
                        case 'method':
                            kind = PreprocessorTokenKind.MethodKeyword;
                            break;
                        case 'function':
                            kind = PreprocessorTokenKind.FunctionKeyword;
                            break;
                        case 'class':
                            kind = PreprocessorTokenKind.ClassKeyword;
                            break;
                        case 'and':
                            kind = PreprocessorTokenKind.AndKeyword;
                            break;
                        case 'or':
                            kind = PreprocessorTokenKind.OrKeyword;
                            break;
                        case 'shl':
                            kind = PreprocessorTokenKind.ShlKeyword;
                            break;
                        case 'shr':
                            kind = PreprocessorTokenKind.ShrKeyword;
                            break;
                        case 'end':
                            kind = PreprocessorTokenKind.EndKeyword;
                            break;
                        case 'if':
                            kind = PreprocessorTokenKind.IfKeyword;
                            break;
                        case 'then':
                            kind = PreprocessorTokenKind.ThenKeyword;
                            break;
                        case 'else':
                            kind = PreprocessorTokenKind.ElseKeyword;
                            break;
                        case 'elseif':
                            kind = PreprocessorTokenKind.ElseIfKeyword;
                            break;
                        case 'endif':
                            kind = PreprocessorTokenKind.EndIfKeyword;
                            break;
                        case 'while':
                            kind = PreprocessorTokenKind.WhileKeyword;
                            break;
                        case 'wend':
                            kind = PreprocessorTokenKind.WendKeyword;
                            break;
                        case 'repeat':
                            kind = PreprocessorTokenKind.RepeatKeyword;
                            break;
                        case 'until':
                            kind = PreprocessorTokenKind.UntilKeyword;
                            break;
                        case 'forever':
                            kind = PreprocessorTokenKind.ForeverKeyword;
                            break;
                        case 'for':
                            kind = PreprocessorTokenKind.ForKeyword;
                            break;
                        case 'to':
                            kind = PreprocessorTokenKind.ToKeyword;
                            break;
                        case 'step':
                            kind = PreprocessorTokenKind.StepKeyword;
                            break;
                        case 'next':
                            kind = PreprocessorTokenKind.NextKeyword;
                            break;
                        case 'return':
                            kind = PreprocessorTokenKind.ReturnKeyword;
                            break;
                        case 'interface':
                            kind = PreprocessorTokenKind.InterfaceKeyword;
                            break;
                        case 'implements':
                            kind = PreprocessorTokenKind.ImplementsKeyword;
                            break;
                        case 'inline':
                            kind = PreprocessorTokenKind.InlineKeyword;
                            break;
                        case 'alias':
                            kind = PreprocessorTokenKind.AliasKeyword;
                            break;
                        case 'try':
                            kind = PreprocessorTokenKind.TryKeyword;
                            break;
                        case 'catch':
                            kind = PreprocessorTokenKind.CatchKeyword;
                            break;
                        case 'throw':
                            kind = PreprocessorTokenKind.ThrowKeyword;
                            break;
                        case 'throwable':
                            kind = PreprocessorTokenKind.ThrowableKeyword;
                            break;
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
