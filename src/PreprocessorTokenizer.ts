import { Token, Tokens } from './Token/Token';
import { TokenKind } from './Token/TokenKind';

export class PreprocessorTokenizer {
    private document: string;
    private position: number;
    private line: number;
    private lineStart: number;
    /**
     * Track directive nesting.
     */
    private nesting: Array<TokenKind.RemDirectiveKeyword | TokenKind.IfDirectiveKeyword>;
    private stringLiteralTerminatorIndex: number;
    private configurationTagTerminatorIndex: number;

    getTokens(document: string): Tokens[] {
        this.document = document;
        this.position = 0;
        this.line = 1;
        this.lineStart = 0;
        this.nesting = [];
        this.stringLiteralTerminatorIndex = -1;
        this.configurationTagTerminatorIndex = -1;

        const tokens: Tokens[] = [];
        let token: Tokens;
        do {
            token = this.next();
            tokens.push(token);
        } while (token.kind !== TokenKind.EOF);

        return tokens;
    }

    private next(): Tokens {
        let kind = TokenKind.Unknown;
        const fullStart = this.position;

        if (this.stringLiteralTerminatorIndex === -1) {
            // Read trivia

            // Read whitespace
            while (isWhitespace(this.getChar())) {
                this.position++;
            }

            // Read line comment
            if (this.getChar() === '\'') {
                this.position++;

                while (isLineCommentChar(this.getChar())) {
                    this.position++;
                }
            }
        }

        // TODO: Should Rem directives be treated as trivia?

        const start = this.position;

        if (this.getChar() === null) {
            kind = TokenKind.EOF;

            return new Token(kind, fullStart, start, this.position - fullStart);
        }

        const inDirective = this.nesting[this.nesting.length - 1];
        /**
         * Rem directives may have Rem and If directives nested within them. Special handling is required so that
         * End directives from those directives do not cause Rem directive body tokenizing to end early.
         */
        if (inDirective === TokenKind.RemDirectiveKeyword) {
            if (this.getChar() === '#') {
                const position = this.position;

                this.position++;

                while (isWhitespace(this.getChar())) {
                    this.position++;
                }

                kind = this.tryReadPreprocessorDirective();
                switch (kind) {
                    case TokenKind.RemDirectiveKeyword:
                    case TokenKind.IfDirectiveKeyword:
                    case TokenKind.EndDirectiveKeyword: {
                        this.position = position;

                        kind = TokenKind.NumberSign;
                        this.position++;
                        break;
                    }
                }
            }

            if (kind !== TokenKind.NumberSign) {
                kind = this.tryReadPreprocessorDirective();
                switch (kind) {
                    case TokenKind.RemDirectiveKeyword:
                    case TokenKind.IfDirectiveKeyword: {
                        this.nesting.push(kind);
                        break;
                    }
                    case TokenKind.EndDirectiveKeyword: {
                        this.nesting.pop();
                        break;
                    }
                    default: {
                        kind = TokenKind.RemDirectiveBody;

                        let continueReading = true;
                        while (continueReading) {
                            switch (this.getChar()) {
                                case null: {
                                    continueReading = false;
                                    break;
                                }
                                case '\n': {
                                    this.position++;

                                    this.line++;
                                    this.lineStart = this.position;
                                    break;
                                }
                                case '#': {
                                    const position = this.position;

                                    this.position++;

                                    while (isWhitespace(this.getChar())) {
                                        this.position++;
                                    }

                                    switch (this.tryReadPreprocessorDirective()) {
                                        case TokenKind.RemDirectiveKeyword:
                                        case TokenKind.IfDirectiveKeyword:
                                        case TokenKind.EndDirectiveKeyword: {
                                            /**
                                             * Found a directive token that should be consumed on next call. Stop reading the current token and
                                             * rewind the tokenizer to the `#` character.
                                             */
                                            continueReading = false;
                                            this.position = position;
                                            break;
                                        }
                                        default: {
                                            this.position++;
                                            break;
                                        }
                                    }
                                    break;
                                }
                                default: {
                                    this.position++;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        } else if (this.stringLiteralTerminatorIndex !== -1) {
            switch (this.getChar()) {
                case '"': {
                    kind = TokenKind.QuotationMark;
                    this.position++;

                    this.stringLiteralTerminatorIndex = -1;
                    break;
                }
                case '~': {
                    kind = TokenKind.InvalidEscapeSequence;
                    this.position++;

                    switch (this.getChar()) {
                        case '~': {
                            kind = TokenKind.EscapeTilde;
                            this.position++;
                            break;
                        }
                        case 'q': {
                            kind = TokenKind.EscapeQuotationMark;
                            this.position++;
                            break;
                        }
                        case 'n': {
                            kind = TokenKind.EscapeLineFeedLf;
                            this.position++;
                            break;
                        }
                        case 'r': {
                            kind = TokenKind.EscapeCarriageReturnCr;
                            this.position++;
                            break;
                        }
                        case 't': {
                            kind = TokenKind.EscapeCharacterTabulation;
                            this.position++;
                            break;
                        }
                        case '0': {
                            kind = TokenKind.EscapeNull;
                            this.position++;
                            break;
                        }
                        case 'u': {
                            kind = TokenKind.EscapeUnicodeHexValue;
                            this.position++;

                            for (let i = 0; i < 4; i++) {
                                if (!isHexadecimal(this.getChar())) {
                                    kind = TokenKind.InvalidEscapeSequence;
                                    break;
                                }

                                this.position++;
                            }
                            break;
                        }
                    }
                    break;
                }
                case '$': {
                    if (this.getChar(1) === '{') {
                        const configurationTagTerminatorIndex = this.document.indexOf('}', this.position + 2);
                        if (configurationTagTerminatorIndex !== -1 &&
                            configurationTagTerminatorIndex < this.stringLiteralTerminatorIndex) {
                            kind = TokenKind.ConfigurationTagStart;
                            this.position += 2;

                            this.configurationTagTerminatorIndex = configurationTagTerminatorIndex;
                            break;
                        }
                    }
                    break;
                }
                case '}': {
                    if (this.configurationTagTerminatorIndex !== -1) {
                        kind = TokenKind.ConfigurationTagEnd;
                        this.position++;

                        this.configurationTagTerminatorIndex = -1;
                    }
                    break;
                }
            }

            if (kind === TokenKind.Unknown) {
                if (this.configurationTagTerminatorIndex !== -1) {
                    kind = TokenKind.Identifier;
                    this.position++;

                    while (isConfigurationTagChar(this.getChar())) {
                        this.position++;
                    }
                } else {
                    kind = TokenKind.StringLiteralText;
                    this.position++;

                    while (isStringLiteralTextChar(this.getChar())) {
                        this.position++;
                    }
                }
            }
        } else {
            switch (this.getChar()) {
                case '\n': {
                    kind = TokenKind.Newline;
                    this.position++;

                    this.line++;
                    this.lineStart = this.position;
                    break;
                }
                case '"': {
                    kind = TokenKind.QuotationMark;
                    this.position++;

                    // Search for the string literal terminator. If it can't be found, don't switch to string literal
                    // tokenizing mode. This allows the parser to handle it as an incomplete string literal without 
                    // consuming the entire rest of the document.
                    this.stringLiteralTerminatorIndex = this.document.indexOf('"', this.position);
                    break;
                }
                case '#': {
                    kind = TokenKind.NumberSign;
                    this.position++;
                    break;
                }
                case '%': {
                    kind = TokenKind.PercentSign;
                    this.position++;

                    while (isBinary(this.getChar())) {
                        kind = TokenKind.IntegerLiteral;
                        this.position++;
                    }
                    break;
                }
                case '$': {
                    kind = TokenKind.DollarSign;
                    this.position++;

                    while (isHexadecimal(this.getChar())) {
                        kind = TokenKind.IntegerLiteral;
                        this.position++;
                    }
                    break;
                }
                case '&': {
                    kind = TokenKind.Ampersand;
                    this.position++;

                    if (this.getChar() === '=') {
                        kind = TokenKind.AmpersandEqualsSign;
                        this.position++;
                    }
                    break;
                }
                case '(': {
                    kind = TokenKind.OpeningParenthesis;
                    this.position++;
                    break;
                }
                case ')': {
                    kind = TokenKind.ClosingParenthesis;
                    this.position++;
                    break;
                }
                case '*': {
                    kind = TokenKind.Asterisk;
                    this.position++;

                    if (this.getChar() === '=') {
                        kind = TokenKind.AsteriskEqualsSign;
                        this.position++;
                    }
                    break;
                }
                case '+': {
                    kind = TokenKind.PlusSign;
                    this.position++;

                    if (this.getChar() === '=') {
                        kind = TokenKind.PlusSignEqualsSign;
                        this.position++;
                    }
                    break;
                }
                case ',': {
                    kind = TokenKind.Comma;
                    this.position++;
                    break;
                }
                case '-': {
                    kind = TokenKind.HyphenMinus;
                    this.position++;

                    if (this.getChar() === '=') {
                        kind = TokenKind.HyphenMinusEqualsSign;
                        this.position++;
                    }
                    break;
                }
                case '/': {
                    kind = TokenKind.Slash;
                    this.position++;

                    if (this.getChar() === '=') {
                        kind = TokenKind.SlashEqualsSign;
                        this.position++;
                    }
                    break;
                }
                case ':': {
                    kind = TokenKind.Colon;
                    this.position++;

                    if (this.getChar() === '=') {
                        kind = TokenKind.ColonEqualsSign;
                        this.position++;
                    }
                    break;
                }
                case ';': {
                    kind = TokenKind.Semicolon;
                    this.position++;
                    break;
                }
                case '<': {
                    kind = TokenKind.LessThanSign;
                    this.position++;

                    switch (this.getChar()) {
                        case '=': {
                            kind = TokenKind.LessThanSignEqualsSign;
                            this.position++;
                            break;
                        }
                        case '>': {
                            kind = TokenKind.LessThanSignGreaterThanSign;
                            this.position++;
                            break;
                        }
                    }
                    break;
                }
                case '=': {
                    kind = TokenKind.EqualsSign;
                    this.position++;
                    break;
                }
                case '>': {
                    kind = TokenKind.GreaterThanSign;
                    this.position++;
                    break;
                }
                case '?': {
                    kind = TokenKind.QuestionMark;
                    this.position++;
                    break;
                }
                case '@': {
                    kind = TokenKind.CommercialAt;
                    this.position++;
                    break;
                }
                case '[': {
                    kind = TokenKind.OpeningSquareBracket;
                    this.position++;
                    break;
                }
                case ']': {
                    kind = TokenKind.ClosingSquareBracket;
                    this.position++;
                    break;
                }
                case '|': {
                    kind = TokenKind.VerticalBar;
                    this.position++;

                    if (this.getChar() === '=') {
                        kind = TokenKind.VerticalBarEqualsSign;
                        this.position++;
                    }
                    break;
                }
                case '~': {
                    kind = TokenKind.Tilde;
                    this.position++;

                    if (this.getChar() === '=') {
                        kind = TokenKind.TildeEqualsSign;
                        this.position++;
                    }
                    break;
                }
                default: {
                    kind = this.tryReadPreprocessorDirective();
                    switch (kind) {
                        case TokenKind.EndDirectiveKeyword: {
                            this.nesting.pop();
                            break;
                        }
                        case TokenKind.RemDirectiveKeyword: {
                            this.nesting.push(kind);
                            break;
                        }
                        case TokenKind.Unknown: {
                            if (isDecimal(this.getChar()) ||
                                (this.getChar() === '.' && isDecimal(this.getChar(1)))) {
                                kind = this.getChar() === '.' ?
                                    TokenKind.FloatLiteral :
                                    TokenKind.IntegerLiteral;
                                this.position++;

                                while (isDecimal(this.getChar())) {
                                    this.position++;
                                }

                                if (kind === TokenKind.IntegerLiteral &&
                                    this.getChar() === '.' &&
                                    isDecimal(this.getChar(1))) {
                                    kind = TokenKind.FloatLiteral;
                                    this.position += 2;

                                    while (isDecimal(this.getChar())) {
                                        this.position++;
                                    }
                                }

                                switch (this.getChar()) {
                                    case 'E':
                                    case 'e': {
                                        kind = TokenKind.FloatLiteral;
                                        this.position++;

                                        switch (this.getChar()) {
                                            case '+':
                                            case '-': {
                                                this.position++;
                                                break;
                                            }
                                        }

                                        while (isDecimal(this.getChar())) {
                                            this.position++;
                                        }
                                        break;
                                    }
                                }
                            } else if (this.getChar() === '.') {
                                kind = TokenKind.Period;
                                this.position++;

                                if (this.getChar() === '.') {
                                    kind = TokenKind.PeriodPeriod;
                                    this.position++;
                                }
                            } else {
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
                                }
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }

        if (kind === TokenKind.Unknown) {
            const col = this.position - this.lineStart + 1;
            console.log(`Unknown token: ${JSON.stringify(this.getChar())} (line: ${this.line}, col: ${col}, pos: ${this.position})`);

            this.position++;
        }

        const length = this.position - fullStart;

        // TODO: Is there a way to drop this type assertion?
        return new Token(kind, fullStart, start, length) as Tokens;
    }

    private tryReadPreprocessorDirective() {
        const start = this.position;
        let kind = TokenKind.Unknown;

        if (this.isPreprocessorDirectiveAllowed()) {
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
                    // TODO: Check if spaces are allowed between else and if.
                    case 'elseif': { kind = TokenKind.ElseIfDirectiveKeyword; break; }
                    case 'else': { kind = TokenKind.ElseDirectiveKeyword; break; }
                    // TODO: Check if spaces are allowed between end and if.
                    case 'endif':
                    case 'end': {
                        // Both #End and #EndIf may terminate #If and #Rem directives.
                        kind = TokenKind.EndDirectiveKeyword;
                        break;
                    }
                    case 'print': { kind = TokenKind.PrintDirectiveKeyword; break; }
                    case 'error': { kind = TokenKind.ErrorDirectiveKeyword; break; }
                    case 'rem': {
                        kind = TokenKind.RemDirectiveKeyword;
                        break;
                    }
                    default: {
                        switch (id) {
                            // TODO: Block CD and MODPATH too?
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
                                kind = TokenKind.ConfigurationVariable;
                                break;
                            }
                        }
                    }
                }
            }
        }

        return kind;
    }

    // Preprocessor directives must start on their own line and may be preceded by whitespace.
    private isPreprocessorDirectiveAllowed(): boolean {
        // Search for whitespace until we hit a `#`, then search for whitespace until we hit the 
        // beginning of the line.
        for (let i = this.position - 1; i >= this.lineStart; i--) {
            if (this.document[i] === '#') {
                for (let j = i - 1; j >= this.lineStart; j--) {
                    if (!isWhitespace(this.document[j])) {
                        return false;
                    }
                }

                return true;
            }

            if (!isWhitespace(this.document[i])) {
                return false;
            }
        }

        return false;
    }

    private tryReadIdentifier(): string | null {
        if (!isIdentifierStartChar(this.getChar())) {
            return null;
        }

        const start = this.position;
        this.position++;

        while (isIdentifierChar(this.getChar())) {
            this.position++;
        }

        return this.document.slice(start, this.position);
    }

    private getChar(offset: number = 0): string | null {
        const nextPosition = this.position + offset;

        if (nextPosition >= this.document.length) {
            return null;
        }

        return this.document[nextPosition];
    }
}

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

function isLineCommentChar(c: string | null): boolean {
    switch (c) {
        case null:
        case '\n':
            return false;
    }

    return true;
}

function isStringLiteralTextChar(c: string | null): boolean {
    switch (c) {
        case null:
        case '"':
        case '~':
            return false;
    }

    return true;
}

function isConfigurationTagChar(c: string | null): boolean {
    switch (c) {
        case null:
        case '}':
            return false;
    }

    return true;
}

function isIdentifierStartChar(c: string | null): boolean {
    return c === '_' ||
        isAlpha(c);
}

function isIdentifierChar(c: string | null): boolean {
    return c === '_' ||
        isAlpha(c) ||
        isDecimal(c);
}
