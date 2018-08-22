export class Token {
    constructor(
        public kind: TokenKind,
        public fullStart: number,
        public start: number,
        public length: number) { }

    toJSON(): SerializableToken {
        return {
            kind: TokenKind[this.kind],
            fullStart: this.fullStart,
            start: this.start,
            length: this.length,
        };
    }
}

interface SerializableToken {
    kind: string;
    fullStart: number;
    start: number;
    length: number;
}

export enum TokenKind {
    Unknown,
    EOF,
    Newline,
    IntegerLiteral,
    FloatLiteral,

    StringLiteralText,
    EscapeNull,
    EscapeCharacterTabulation,
    EscapeLineFeedLf,
    EscapeCarriageReturnCr,
    EscapeQuotationMark,
    EscapeTilde,
    EscapeUnicodeHexValue,
    InvalidEscapeSequence,
    
    IfDirectiveKeyword,
    ElseIfDirectiveKeyword,
    ElseDirectiveKeyword,
    EndDirectiveKeyword,
    RemDirectiveKeyword,
    RemDirectiveBody,
    PrintDirectiveKeyword,
    ErrorDirectiveKeyword,
    ConfigVar,
    
    QuotationMark,
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
    
    Identifier,
    VoidKeyword,
    StrictKeyword,
    PublicKeyword,
    PrivateKeyword,
    ProtectedKeyword,
    FriendKeyword,
    PropertyKeyword,
    BoolKeyword,
    IntKeyword,
    FloatKeyword,
    StringKeyword,
    ArrayKeyword,
    ObjectKeyword,
    ModKeyword,
    ContinueKeyword,
    ExitKeyword,
    IncludeKeyword,
    ImportKeyword,
    ModuleKeyword,
    ExternKeyword,
    NewKeyword,
    SelfKeyword,
    SuperKeyword,
    EachInKeyword,
    TrueKeyword,
    FalseKeyword,
    NullKeyword,
    NotKeyword,
    ExtendsKeyword,
    AbstractKeyword,
    FinalKeyword,
    SelectKeyword,
    CaseKeyword,
    DefaultKeyword,
    ConstKeyword,
    LocalKeyword,
    GlobalKeyword,
    FieldKeyword,
    MethodKeyword,
    FunctionKeyword,
    ClassKeyword,
    AndKeyword,
    OrKeyword,
    ShlKeyword,
    ShrKeyword,
    EndKeyword,
    IfKeyword,
    ThenKeyword,
    ElseKeyword,
    ElseIfKeyword,
    EndIfKeyword,
    WhileKeyword,
    WendKeyword,
    RepeatKeyword,
    UntilKeyword,
    ForeverKeyword,
    ForKeyword,
    ToKeyword,
    StepKeyword,
    NextKeyword,
    ReturnKeyword,
    InterfaceKeyword,
    ImplementsKeyword,
    InlineKeyword,
    AliasKeyword,
    TryKeyword,
    CatchKeyword,
    ThrowKeyword,
    ThrowableKeyword,
    
    Expression,
    LessThanOrEquals,
    GreaterThanOrEquals,
    NotEquals,
}