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
}