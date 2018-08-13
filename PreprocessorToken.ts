export class PreprocessorToken {
    constructor(
        public kind: PreprocessorTokenKind,
        public start: number,
        public length: number) { }
}

export enum PreprocessorTokenKind {
    Unknown = 0,
    EOF = 1,
    Newline = 2,
    Whitespace = 3,
    Comment = 4,
    StringLiteral = 5,
    IntegerLiteral = 6,
    FloatLiteral = 7,
}