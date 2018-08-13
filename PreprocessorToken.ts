export class PreprocessorToken {
    constructor(
        public kind: PreprocessorTokenKind,
        public start: number,
        public length: number) { }
}

export enum PreprocessorTokenKind {
    Unknown,
    EOF,
    Newline,
    Whitespace,
    Comment,
    StringLiteral,
    IntegerLiteral,
    FloatLiteral,
    NumberSign,
    Ampersand,
    OpeningParenthesis,
    ClosingParenthesis,
    Asterisk,
    PlusSign,
    Comma,
    HyphenMinus,
    Period,
    Slash,
    Colon,
    Semicolon,
    LessThanSign,
    EqualsSign,
    GreaterThanSign,
    QuestionMark,
    CommercialAt,
    OpeningSquareBracket,
    ClosingSquareBracket,
    VerticalBar,
    Tilde,
}