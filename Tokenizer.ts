import { Token, TokenKind } from "./Token";

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

export class Tokenizer {
    constructor(private readonly input: string) { }

    private position: number = -1;
    private remDirectiveLevel: number = 0;

    next(): Token {
        let c = this.nextChar();

        let kind = TokenKind.Unknown;
        const start = this.position;

        if (this.remDirectiveLevel > 0) {
            kind = this.tryReadPreprocessorDirective();
            switch (kind) {
                case TokenKind.RemDirectiveKeyword: {
                    this.remDirectiveLevel++;
                    break;
                }
                case TokenKind.EndDirectiveKeyword: {
                    this.remDirectiveLevel--;
                    break;
                }
                default: {
                    kind = TokenKind.RemDirectiveBody;

                    while (c !== null) {
                        const pos = this.position - 1;
                        const nextKind = this.tryReadPreprocessorDirective();
                        if (nextKind === TokenKind.RemDirectiveKeyword ||
                            nextKind === TokenKind.EndDirectiveKeyword) {
                            this.position = pos;
                            break;
                        } else {
                            this.position++;
                            c = this.peekChar();
                        }
                    }
                    break;
                }
            }
        } else {
            switch (c) {
                case null: { kind = TokenKind.EOF; break; }
                case '\n': { kind = TokenKind.Newline; break; }
                case "'": {
                    kind = TokenKind.Comment
    
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
                                kind = TokenKind.StringLiteral
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
                    kind = TokenKind.IntegerLiteral;
    
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
                    kind = TokenKind.IntegerLiteral;
    
                    while (isHexadecimal(this.peekChar())) {
                        this.position++;
                    }
                    break;
                }
                case '&': { kind = TokenKind.Ampersand; break; }
                case '(': { kind = TokenKind.OpeningParenthesis; break; }
                case ')': { kind = TokenKind.ClosingParenthesis; break; }
                case '*': { kind = TokenKind.Asterisk; break; }
                case '+': { kind = TokenKind.PlusSign; break; }
                case ',': { kind = TokenKind.Comma; break; }
                case '-': { kind = TokenKind.HyphenMinus; break; }
                case '.': { kind = TokenKind.Period; break; }
                case '/': { kind = TokenKind.Slash; break; }
                case ':': { kind = TokenKind.Colon; break; }
                case ';': { kind = TokenKind.Semicolon; break; }
                case '<': { kind = TokenKind.LessThanSign; break; }
                case '=': { kind = TokenKind.EqualsSign; break; }
                case '>': { kind = TokenKind.GreaterThanSign; break; }
                case '?': { kind = TokenKind.QuestionMark; break; }
                case '@': { kind = TokenKind.CommercialAt; break; }
                case '[': { kind = TokenKind.OpeningSquareBracket; break; }
                case ']': { kind = TokenKind.ClosingSquareBracket; break; }
                case '|': { kind = TokenKind.VerticalBar; break; }
                case '~': { kind = TokenKind.Tilde; break; }
                default: {
                    kind = this.tryReadPreprocessorDirective();
                    if (kind !== TokenKind.Unknown) {
                        break;
                    }
    
                    if (isWhitespace(c)) {
                        kind = TokenKind.Whitespace;
    
                        while (isWhitespace(this.peekChar())) {
                            this.position++;
                        }
                    } else if (isDecimal(c) ||
                        (c === '.' && isDecimal(this.peekChar()))) {
                        kind = TokenKind.IntegerLiteral;
    
                        if (c === '.') {
                            kind = TokenKind.FloatLiteral;
                        }
    
                        while (isDecimal(this.peekChar())) {
                            this.position++;
                        }
    
                        if (kind === TokenKind.IntegerLiteral &&
                            this.peekChar() === '.' &&
                            isDecimal(this.peekChar(2))) {
                            this.position++;
                            kind = TokenKind.FloatLiteral;
    
                            while (isDecimal(this.peekChar())) {
                                this.position++;
                            }
                        }
    
                        switch (this.peekChar()) {
                            case 'E':
                            case 'e': {
                                this.position++;
                                kind = TokenKind.FloatLiteral;
    
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
                    } else {
                        // Walk back so `tryReadIdentifier` can read the first character.
                        this.position--;
                        const id = this.tryReadIdentifier();
                        if (id !== null) {
                            kind = TokenKind.Identifier;
    
                            switch (id.toLowerCase()) {
                                case 'void': { kind = TokenKind.VoidKeyword; break; }
                                case 'strict': { kind = TokenKind.StrictKeyword; break; }
                                case 'public': { kind = TokenKind.PublicKeyword; break; }
                                case 'private': { kind = TokenKind.PrivateKeyword; break; }
                                case 'protected': { kind = TokenKind.ProtectedKeyword; break; }
                                case 'friend': { kind = TokenKind.FriendKeyword; break; }
                                case 'property': { kind = TokenKind.PropertyKeyword; break; }
                                case 'bool': { kind = TokenKind.BoolKeyword; break; }
                                case 'int': { kind = TokenKind.IntKeyword; break; }
                                case 'float': { kind = TokenKind.FloatKeyword; break; }
                                case 'string': { kind = TokenKind.StringKeyword; break; }
                                case 'array': { kind = TokenKind.ArrayKeyword; break; }
                                case 'object': { kind = TokenKind.ObjectKeyword; break; }
                                case 'mod': { kind = TokenKind.ModKeyword; break; }
                                case 'continue': { kind = TokenKind.ContinueKeyword; break; }
                                case 'exit': { kind = TokenKind.ExitKeyword; break; }
                                case 'include': { kind = TokenKind.IncludeKeyword; break; }
                                case 'import': { kind = TokenKind.ImportKeyword; break; }
                                case 'module': { kind = TokenKind.ModuleKeyword; break; }
                                case 'extern': { kind = TokenKind.ExternKeyword; break; }
                                case 'new': { kind = TokenKind.NewKeyword; break; }
                                case 'self': { kind = TokenKind.SelfKeyword; break; }
                                case 'super': { kind = TokenKind.SuperKeyword; break; }
                                case 'eachin': { kind = TokenKind.EachInKeyword; break; }
                                case 'true': { kind = TokenKind.TrueKeyword; break; }
                                case 'false': { kind = TokenKind.FalseKeyword; break; }
                                case 'null': { kind = TokenKind.NullKeyword; break; }
                                case 'not': { kind = TokenKind.NotKeyword; break; }
                                case 'extends': { kind = TokenKind.ExtendsKeyword; break; }
                                case 'abstract': { kind = TokenKind.AbstractKeyword; break; }
                                case 'final': { kind = TokenKind.FinalKeyword; break; }
                                case 'select': { kind = TokenKind.SelectKeyword; break; }
                                case 'case': { kind = TokenKind.CaseKeyword; break; }
                                case 'default': { kind = TokenKind.DefaultKeyword; break; }
                                case 'const': { kind = TokenKind.ConstKeyword; break; }
                                case 'local': { kind = TokenKind.LocalKeyword; break; }
                                case 'global': { kind = TokenKind.GlobalKeyword; break; }
                                case 'field': { kind = TokenKind.FieldKeyword; break; }
                                case 'method': { kind = TokenKind.MethodKeyword; break; }
                                case 'function': { kind = TokenKind.FunctionKeyword; break; }
                                case 'class': { kind = TokenKind.ClassKeyword; break; }
                                case 'and': { kind = TokenKind.AndKeyword; break; }
                                case 'or': { kind = TokenKind.OrKeyword; break; }
                                case 'shl': { kind = TokenKind.ShlKeyword; break; }
                                case 'shr': { kind = TokenKind.ShrKeyword; break; }
                                case 'end': { kind = TokenKind.EndKeyword; break; }
                                case 'if': { kind = TokenKind.IfKeyword; break; }
                                case 'then': { kind = TokenKind.ThenKeyword; break; }
                                case 'else': { kind = TokenKind.ElseKeyword; break; }
                                case 'elseif': { kind = TokenKind.ElseIfKeyword; break; }
                                case 'endif': { kind = TokenKind.EndIfKeyword; break; }
                                case 'while': { kind = TokenKind.WhileKeyword; break; }
                                case 'wend': { kind = TokenKind.WendKeyword; break; }
                                case 'repeat': { kind = TokenKind.RepeatKeyword; break; }
                                case 'until': { kind = TokenKind.UntilKeyword; break; }
                                case 'forever': { kind = TokenKind.ForeverKeyword; break; }
                                case 'for': { kind = TokenKind.ForKeyword; break; }
                                case 'to': { kind = TokenKind.ToKeyword; break; }
                                case 'step': { kind = TokenKind.StepKeyword; break; }
                                case 'next': { kind = TokenKind.NextKeyword; break; }
                                case 'return': { kind = TokenKind.ReturnKeyword; break; }
                                case 'interface': { kind = TokenKind.InterfaceKeyword; break; }
                                case 'implements': { kind = TokenKind.ImplementsKeyword; break; }
                                case 'inline': { kind = TokenKind.InlineKeyword; break; }
                                case 'alias': { kind = TokenKind.AliasKeyword; break; }
                                case 'try': { kind = TokenKind.TryKeyword; break; }
                                case 'catch': { kind = TokenKind.CatchKeyword; break; }
                                case 'throw': { kind = TokenKind.ThrowKeyword; break; }
                                case 'throwable': { kind = TokenKind.ThrowableKeyword; break; }
                            }
                        } else {
                            // Rollback walk back.
                            this.position = start;
                        }
                    }
                    break;
                }
            }
        }

        let length: number;
        switch (kind) {
            case TokenKind.EOF: {
                length = 0;
                break;
            }
            default: {
                length = this.position - start + 1;
                break;
            }
        }

        return new Token(kind, start, length);
    }

    private tryReadPreprocessorDirective(): TokenKind {
        const start = this.position;
        let kind = TokenKind.Unknown;

        if (this.input[this.position] === '#') {
            while (isWhitespace(this.peekChar())) {
                this.position++;
            }

            const id = this.tryReadIdentifier();
            if (id !== null) {
                switch (id.toLowerCase()) {
                    case 'void':
                    case 'strict':
                    case 'public':
                    case 'private':
                    case 'protected':
                    case 'friend':
                    case 'property':
                    case 'bool':
                    case 'int':
                    case 'float':
                    case 'string':
                    case 'array':
                    case 'object':
                    case 'mod':
                    case 'continue':
                    case 'exit':
                    case 'include':
                    case 'import':
                    case 'module':
                    case 'extern':
                    case 'new':
                    case 'self':
                    case 'super':
                    case 'eachin':
                    case 'true':
                    case 'false':
                    case 'null':
                    case 'not':
                    case 'extends':
                    case 'abstract':
                    case 'final':
                    case 'select':
                    case 'case':
                    case 'default':
                    case 'const':
                    case 'local':
                    case 'global':
                    case 'field':
                    case 'method':
                    case 'function':
                    case 'class':
                    case 'and':
                    case 'or':
                    case 'shl':
                    case 'shr':
                    case 'then':
                    case 'while':
                    case 'wend':
                    case 'repeat':
                    case 'until':
                    case 'forever':
                    case 'for':
                    case 'to':
                    case 'step':
                    case 'next':
                    case 'return':
                    case 'interface':
                    case 'implements':
                    case 'inline':
                    case 'alias':
                    case 'try':
                    case 'catch':
                    case 'throw':
                    case 'throwable': {
                        this.position = start;
                        break;
                    }
                    case 'if': { kind = TokenKind.IfDirectiveKeyword; break; }
                    case 'elseif': { kind = TokenKind.ElseIfDirectiveKeyword; break; }
                    case 'else': { kind = TokenKind.ElseDirectiveKeyword; break; }
                    case 'endif':
                    case 'end': {
                        kind = TokenKind.EndDirectiveKeyword;
                        break;
                    }
                    case 'print': { kind = TokenKind.PrintDirectiveKeyword; break; }
                    case 'error': { kind = TokenKind.ErrorDirectiveKeyword; break; }
                    case 'rem': {
                        kind = TokenKind.RemDirectiveKeyword;
                        this.remDirectiveLevel++;
                        break;
                    }
                    default: {
                        switch (id) {
                            case 'HOST':
                            case 'LANG':
                            case 'CONFIG':
                            case 'TARGET':
                            case 'SAFEMODE': {
                                // App config vars cannot be modified.
                                this.position = start;
                                break;
                            }
                            default: {
                                kind = TokenKind.ConfigVar;
                                break;
                            }
                        }
                    }
                }
            } else {
                // Unrecognized preprocessor directive.
                // Rollback whitespace.
                this.position = start;
            }
        }

        return kind;
    }

    private tryReadIdentifier(): string | null {
        let c = this.peekChar();

        if (c === '_' ||
            isAlpha(c)) {
            this.position++;
            const start = this.position;

            while (true) {
                c = this.peekChar();
                if (c !== '_' &&
                    !isAlpha(c) &&
                    !isDecimal(c)) {
                    break;
                }
                this.position++;
            }

            return this.input.slice(start, this.position + 1);
        }

        return null;
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
