import { MissingTokenKinds, MissingToken } from './MissingToken';
import { SkippedToken } from './SkippedToken';

export class Token<TTokenKind extends ErrorableTokenKinds> {
    constructor(
        readonly kind: TTokenKind,
        readonly fullStart: number,
        readonly start: number,
        readonly length: number,
    ) { }

    get end(): number {
        return this.fullStart + this.length;
    }

    getFullText(document: string): string {
        return document.slice(this.fullStart, this.fullStart + this.length);
    }

    getText(document: string): string {
        return document.slice(this.start, this.fullStart + this.length);
    }
}

// #region Tokens

export enum TokenKind {
    Unknown = 'Unknown',
    EOF = 'EOF',
    Newline = 'Newline',
    IntegerLiteral = 'IntegerLiteral',
    FloatLiteral = 'FloatLiteral',

    StringLiteralText = 'StringLiteralText',
    EscapeNull = 'EscapeNull',
    EscapeCharacterTabulation = 'EscapeCharacterTabulation',
    EscapeLineFeedLf = 'EscapeLineFeedLf',
    EscapeCarriageReturnCr = 'EscapeCarriageReturnCr',
    EscapeQuotationMark = 'EscapeQuotationMark',
    EscapeTilde = 'EscapeTilde',
    EscapeUnicodeHexValue = 'EscapeUnicodeHexValue',
    InvalidEscapeSequence = 'InvalidEscapeSequence',
    ConfigurationTagStart = 'ConfigurationTagStart',
    ConfigurationTagEnd = 'ConfigurationTagEnd',

    IfDirectiveKeyword = 'IfDirectiveKeyword',
    ElseIfDirectiveKeyword = 'ElseIfDirectiveKeyword',
    ElseDirectiveKeyword = 'ElseDirectiveKeyword',
    EndDirectiveKeyword = 'EndDirectiveKeyword',
    RemDirectiveKeyword = 'RemDirectiveKeyword',
    RemDirectiveBody = 'RemDirectiveBody',
    PrintDirectiveKeyword = 'PrintDirectiveKeyword',
    ErrorDirectiveKeyword = 'ErrorDirectiveKeyword',
    ConfigurationVariable = 'ConfigurationVariable',

    QuotationMark = 'QuotationMark',
    NumberSign = 'NumberSign',
    DollarSign = 'DollarSign',
    PercentSign = 'PercentSign',
    Ampersand = 'Ampersand',
    OpeningParenthesis = 'OpeningParenthesis',
    ClosingParenthesis = 'ClosingParenthesis',
    Asterisk = 'Asterisk',
    PlusSign = 'PlusSign',
    Comma = 'Comma',
    HyphenMinus = 'HyphenMinus',
    Period = 'Period',
    Slash = 'Slash',
    Colon = 'Colon',
    Semicolon = 'Semicolon',
    LessThanSign = 'LessThanSign',
    EqualsSign = 'EqualsSign',
    GreaterThanSign = 'GreaterThanSign',
    QuestionMark = 'QuestionMark',
    CommercialAt = 'CommercialAt',
    OpeningSquareBracket = 'OpeningSquareBracket',
    ClosingSquareBracket = 'ClosingSquareBracket',
    VerticalBar = 'VerticalBar',
    Tilde = 'Tilde',

    PeriodPeriod = 'PeriodPeriod',
    AmpersandEqualsSign = 'AmpersandEqualsSign',
    AsteriskEqualsSign = 'AsteriskEqualsSign',
    PlusSignEqualsSign = 'PlusSignEqualsSign',
    HyphenMinusEqualsSign = 'HyphenMinusEqualsSign',
    SlashEqualsSign = 'SlashEqualsSign',
    ColonEqualsSign = 'ColonEqualsSign',
    LessThanSignEqualsSign = 'LessThanSignEqualsSign',
    GreaterThanSignEqualsSign = 'GreaterThanSignEqualsSign',
    VerticalBarEqualsSign = 'VerticalBarEqualsSign',
    TildeEqualsSign = 'TildeEqualsSign',
    ShlKeywordEqualsSign = 'ShlKeywordEqualsSign',
    ShrKeywordEqualsSign = 'ShrKeywordEqualsSign',
    ModKeywordEqualsSign = 'ModKeywordEqualsSign',
    LessThanSignGreaterThanSign = 'LessThanSignGreaterThanSign',

    Identifier = 'Identifier',
    VoidKeyword = 'VoidKeyword',
    StrictKeyword = 'StrictKeyword',
    PublicKeyword = 'PublicKeyword',
    PrivateKeyword = 'PrivateKeyword',
    ProtectedKeyword = 'ProtectedKeyword',
    FriendKeyword = 'FriendKeyword',
    PropertyKeyword = 'PropertyKeyword',
    BoolKeyword = 'BoolKeyword',
    IntKeyword = 'IntKeyword',
    FloatKeyword = 'FloatKeyword',
    StringKeyword = 'StringKeyword',
    ArrayKeyword = 'ArrayKeyword',
    ObjectKeyword = 'ObjectKeyword',
    ModKeyword = 'ModKeyword',
    ContinueKeyword = 'ContinueKeyword',
    ExitKeyword = 'ExitKeyword',
    IncludeKeyword = 'IncludeKeyword',
    ImportKeyword = 'ImportKeyword',
    ModuleKeyword = 'ModuleKeyword',
    ExternKeyword = 'ExternKeyword',
    NewKeyword = 'NewKeyword',
    SelfKeyword = 'SelfKeyword',
    SuperKeyword = 'SuperKeyword',
    EachInKeyword = 'EachInKeyword',
    TrueKeyword = 'TrueKeyword',
    FalseKeyword = 'FalseKeyword',
    NullKeyword = 'NullKeyword',
    NotKeyword = 'NotKeyword',
    ExtendsKeyword = 'ExtendsKeyword',
    AbstractKeyword = 'AbstractKeyword',
    FinalKeyword = 'FinalKeyword',
    SelectKeyword = 'SelectKeyword',
    CaseKeyword = 'CaseKeyword',
    DefaultKeyword = 'DefaultKeyword',
    ConstKeyword = 'ConstKeyword',
    LocalKeyword = 'LocalKeyword',
    GlobalKeyword = 'GlobalKeyword',
    FieldKeyword = 'FieldKeyword',
    MethodKeyword = 'MethodKeyword',
    FunctionKeyword = 'FunctionKeyword',
    ClassKeyword = 'ClassKeyword',
    AndKeyword = 'AndKeyword',
    OrKeyword = 'OrKeyword',
    ShlKeyword = 'ShlKeyword',
    ShrKeyword = 'ShrKeyword',
    EndKeyword = 'EndKeyword',
    IfKeyword = 'IfKeyword',
    ThenKeyword = 'ThenKeyword',
    ElseKeyword = 'ElseKeyword',
    ElseIfKeyword = 'ElseIfKeyword',
    EndIfKeyword = 'EndIfKeyword',
    WhileKeyword = 'WhileKeyword',
    WendKeyword = 'WendKeyword',
    RepeatKeyword = 'RepeatKeyword',
    UntilKeyword = 'UntilKeyword',
    ForeverKeyword = 'ForeverKeyword',
    ForKeyword = 'ForKeyword',
    ToKeyword = 'ToKeyword',
    StepKeyword = 'StepKeyword',
    NextKeyword = 'NextKeyword',
    ReturnKeyword = 'ReturnKeyword',
    InterfaceKeyword = 'InterfaceKeyword',
    ImplementsKeyword = 'ImplementsKeyword',
    InlineKeyword = 'InlineKeyword',
    AliasKeyword = 'AliasKeyword',
    TryKeyword = 'TryKeyword',
    CatchKeyword = 'CatchKeyword',
    ThrowKeyword = 'ThrowKeyword',
    ThrowableKeyword = 'ThrowableKeyword',

    Missing = 'Missing',
    Skipped = 'Skipped',
    Expression = 'Expression',
    ImportStatementPath = 'ImportStatementPath',
}

export type UnknownToken = Token<TokenKind.Unknown>;
export type EOFToken = Token<TokenKind.EOF>;
export type NewlineToken = Token<TokenKind.Newline>;
export type IntegerLiteralToken = Token<TokenKind.IntegerLiteral>;
export type FloatLiteralToken = Token<TokenKind.FloatLiteral>;
export type StringLiteralTextToken = Token<TokenKind.StringLiteralText>;
export type EscapeNullToken = Token<TokenKind.EscapeNull>;
export type EscapeCharacterTabulationToken = Token<TokenKind.EscapeCharacterTabulation>;
export type EscapeLineFeedLfToken = Token<TokenKind.EscapeLineFeedLf>;
export type EscapeCarriageReturnCrToken = Token<TokenKind.EscapeCarriageReturnCr>;
export type EscapeQuotationMarkToken = Token<TokenKind.EscapeQuotationMark>;
export type EscapeTildeToken = Token<TokenKind.EscapeTilde>;
export type EscapeUnicodeHexValueToken = Token<TokenKind.EscapeUnicodeHexValue>;
export type InvalidEscapeSequenceToken = Token<TokenKind.InvalidEscapeSequence>;
export type ConfigurationTagStartToken = Token<TokenKind.ConfigurationTagStart>;
export type ConfigurationTagEndToken = Token<TokenKind.ConfigurationTagEnd>;
export type IfDirectiveKeywordToken = Token<TokenKind.IfDirectiveKeyword>;
export type ElseIfDirectiveKeywordToken = Token<TokenKind.ElseIfDirectiveKeyword>;
export type ElseDirectiveKeywordToken = Token<TokenKind.ElseDirectiveKeyword>;
export type EndDirectiveKeywordToken = Token<TokenKind.EndDirectiveKeyword>;
export type RemDirectiveKeywordToken = Token<TokenKind.RemDirectiveKeyword>;
export type RemDirectiveBodyToken = Token<TokenKind.RemDirectiveBody>;
export type PrintDirectiveKeywordToken = Token<TokenKind.PrintDirectiveKeyword>;
export type ErrorDirectiveKeywordToken = Token<TokenKind.ErrorDirectiveKeyword>;
export type ConfigurationVariableToken = Token<TokenKind.ConfigurationVariable>;
export type QuotationMarkToken = Token<TokenKind.QuotationMark>;
export type NumberSignToken = Token<TokenKind.NumberSign>;
export type DollarSignToken = Token<TokenKind.DollarSign>;
export type PercentSignToken = Token<TokenKind.PercentSign>;
export type AmpersandToken = Token<TokenKind.Ampersand>;
export type OpeningParenthesisToken = Token<TokenKind.OpeningParenthesis>;
export type ClosingParenthesisToken = Token<TokenKind.ClosingParenthesis>;
export type AsteriskToken = Token<TokenKind.Asterisk>;
export type PlusSignToken = Token<TokenKind.PlusSign>;
export type CommaToken = Token<TokenKind.Comma>;
export type HyphenMinusToken = Token<TokenKind.HyphenMinus>;
export type PeriodToken = Token<TokenKind.Period>;
export type SlashToken = Token<TokenKind.Slash>;
export type ColonToken = Token<TokenKind.Colon>;
export type SemicolonToken = Token<TokenKind.Semicolon>;
export type LessThanSignToken = Token<TokenKind.LessThanSign>;
export type EqualsSignToken = Token<TokenKind.EqualsSign>;
export type GreaterThanSignToken = Token<TokenKind.GreaterThanSign>;
export type QuestionMarkToken = Token<TokenKind.QuestionMark>;
export type CommercialAtToken = Token<TokenKind.CommercialAt>;
export type OpeningSquareBracketToken = Token<TokenKind.OpeningSquareBracket>;
export type ClosingSquareBracketToken = Token<TokenKind.ClosingSquareBracket>;
export type VerticalBarToken = Token<TokenKind.VerticalBar>;
export type TildeToken = Token<TokenKind.Tilde>;
export type PeriodPeriodToken = Token<TokenKind.PeriodPeriod>;
export type AmpersandEqualsSignToken = Token<TokenKind.AmpersandEqualsSign>;
export type AsteriskEqualsSignToken = Token<TokenKind.AsteriskEqualsSign>;
export type PlusSignEqualsSignToken = Token<TokenKind.PlusSignEqualsSign>;
export type HyphenMinusEqualsSignToken = Token<TokenKind.HyphenMinusEqualsSign>;
export type SlashEqualsSignToken = Token<TokenKind.SlashEqualsSign>;
export type ColonEqualsSignToken = Token<TokenKind.ColonEqualsSign>;
export type LessThanSignEqualsSignToken = Token<TokenKind.LessThanSignEqualsSign>;
export type GreaterThanSignEqualsSignToken = Token<TokenKind.GreaterThanSignEqualsSign>;
export type VerticalBarEqualsSignToken = Token<TokenKind.VerticalBarEqualsSign>;
export type TildeEqualsSignToken = Token<TokenKind.TildeEqualsSign>;
export type ShlKeywordEqualsSignToken = Token<TokenKind.ShlKeywordEqualsSign>;
export type ShrKeywordEqualsSignToken = Token<TokenKind.ShrKeywordEqualsSign>;
export type ModKeywordEqualsSignToken = Token<TokenKind.ModKeywordEqualsSign>;
export type LessThanSignGreaterThanSignToken = Token<TokenKind.LessThanSignGreaterThanSign>;
export type IdentifierToken = Token<TokenKind.Identifier>;
export type VoidKeywordToken = Token<TokenKind.VoidKeyword>;
export type StrictKeywordToken = Token<TokenKind.StrictKeyword>;
export type PublicKeywordToken = Token<TokenKind.PublicKeyword>;
export type PrivateKeywordToken = Token<TokenKind.PrivateKeyword>;
export type ProtectedKeywordToken = Token<TokenKind.ProtectedKeyword>;
export type FriendKeywordToken = Token<TokenKind.FriendKeyword>;
export type PropertyKeywordToken = Token<TokenKind.PropertyKeyword>;
export type BoolKeywordToken = Token<TokenKind.BoolKeyword>;
export type IntKeywordToken = Token<TokenKind.IntKeyword>;
export type FloatKeywordToken = Token<TokenKind.FloatKeyword>;
export type StringKeywordToken = Token<TokenKind.StringKeyword>;
export type ArrayKeywordToken = Token<TokenKind.ArrayKeyword>;
export type ObjectKeywordToken = Token<TokenKind.ObjectKeyword>;
export type ModKeywordToken = Token<TokenKind.ModKeyword>;
export type ContinueKeywordToken = Token<TokenKind.ContinueKeyword>;
export type ExitKeywordToken = Token<TokenKind.ExitKeyword>;
export type IncludeKeywordToken = Token<TokenKind.IncludeKeyword>;
export type ImportKeywordToken = Token<TokenKind.ImportKeyword>;
export type ModuleKeywordToken = Token<TokenKind.ModuleKeyword>;
export type ExternKeywordToken = Token<TokenKind.ExternKeyword>;
export type NewKeywordToken = Token<TokenKind.NewKeyword>;
export type SelfKeywordToken = Token<TokenKind.SelfKeyword>;
export type SuperKeywordToken = Token<TokenKind.SuperKeyword>;
export type EachInKeywordToken = Token<TokenKind.EachInKeyword>;
export type TrueKeywordToken = Token<TokenKind.TrueKeyword>;
export type FalseKeywordToken = Token<TokenKind.FalseKeyword>;
export type NullKeywordToken = Token<TokenKind.NullKeyword>;
export type NotKeywordToken = Token<TokenKind.NotKeyword>;
export type ExtendsKeywordToken = Token<TokenKind.ExtendsKeyword>;
export type AbstractKeywordToken = Token<TokenKind.AbstractKeyword>;
export type FinalKeywordToken = Token<TokenKind.FinalKeyword>;
export type SelectKeywordToken = Token<TokenKind.SelectKeyword>;
export type CaseKeywordToken = Token<TokenKind.CaseKeyword>;
export type DefaultKeywordToken = Token<TokenKind.DefaultKeyword>;
export type ConstKeywordToken = Token<TokenKind.ConstKeyword>;
export type LocalKeywordToken = Token<TokenKind.LocalKeyword>;
export type GlobalKeywordToken = Token<TokenKind.GlobalKeyword>;
export type FieldKeywordToken = Token<TokenKind.FieldKeyword>;
export type MethodKeywordToken = Token<TokenKind.MethodKeyword>;
export type FunctionKeywordToken = Token<TokenKind.FunctionKeyword>;
export type ClassKeywordToken = Token<TokenKind.ClassKeyword>;
export type AndKeywordToken = Token<TokenKind.AndKeyword>;
export type OrKeywordToken = Token<TokenKind.OrKeyword>;
export type ShlKeywordToken = Token<TokenKind.ShlKeyword>;
export type ShrKeywordToken = Token<TokenKind.ShrKeyword>;
export type EndKeywordToken = Token<TokenKind.EndKeyword>;
export type IfKeywordToken = Token<TokenKind.IfKeyword>;
export type ThenKeywordToken = Token<TokenKind.ThenKeyword>;
export type ElseKeywordToken = Token<TokenKind.ElseKeyword>;
export type ElseIfKeywordToken = Token<TokenKind.ElseIfKeyword>;
export type EndIfKeywordToken = Token<TokenKind.EndIfKeyword>;
export type WhileKeywordToken = Token<TokenKind.WhileKeyword>;
export type WendKeywordToken = Token<TokenKind.WendKeyword>;
export type RepeatKeywordToken = Token<TokenKind.RepeatKeyword>;
export type UntilKeywordToken = Token<TokenKind.UntilKeyword>;
export type ForeverKeywordToken = Token<TokenKind.ForeverKeyword>;
export type ForKeywordToken = Token<TokenKind.ForKeyword>;
export type ToKeywordToken = Token<TokenKind.ToKeyword>;
export type StepKeywordToken = Token<TokenKind.StepKeyword>;
export type NextKeywordToken = Token<TokenKind.NextKeyword>;
export type ReturnKeywordToken = Token<TokenKind.ReturnKeyword>;
export type InterfaceKeywordToken = Token<TokenKind.InterfaceKeyword>;
export type ImplementsKeywordToken = Token<TokenKind.ImplementsKeyword>;
export type InlineKeywordToken = Token<TokenKind.InlineKeyword>;
export type AliasKeywordToken = Token<TokenKind.AliasKeyword>;
export type TryKeywordToken = Token<TokenKind.TryKeyword>;
export type CatchKeywordToken = Token<TokenKind.CatchKeyword>;
export type ThrowKeywordToken = Token<TokenKind.ThrowKeyword>;
export type ThrowableKeywordToken = Token<TokenKind.ThrowableKeyword>;

export type Tokens =
    | UnknownToken
    | EOFToken
    | NewlineToken
    | IntegerLiteralToken
    | FloatLiteralToken
    | StringLiteralTextToken
    | EscapeNullToken
    | EscapeCharacterTabulationToken
    | EscapeLineFeedLfToken
    | EscapeCarriageReturnCrToken
    | EscapeQuotationMarkToken
    | EscapeTildeToken
    | EscapeUnicodeHexValueToken
    | InvalidEscapeSequenceToken
    | ConfigurationTagStartToken
    | ConfigurationTagEndToken
    | IfDirectiveKeywordToken
    | ElseIfDirectiveKeywordToken
    | ElseDirectiveKeywordToken
    | EndDirectiveKeywordToken
    | RemDirectiveKeywordToken
    | RemDirectiveBodyToken
    | PrintDirectiveKeywordToken
    | ErrorDirectiveKeywordToken
    | ConfigurationVariableToken
    | QuotationMarkToken
    | NumberSignToken
    | DollarSignToken
    | PercentSignToken
    | AmpersandToken
    | OpeningParenthesisToken
    | ClosingParenthesisToken
    | AsteriskToken
    | PlusSignToken
    | CommaToken
    | HyphenMinusToken
    | PeriodToken
    | SlashToken
    | ColonToken
    | SemicolonToken
    | LessThanSignToken
    | EqualsSignToken
    | GreaterThanSignToken
    | QuestionMarkToken
    | CommercialAtToken
    | OpeningSquareBracketToken
    | ClosingSquareBracketToken
    | VerticalBarToken
    | TildeToken
    | PeriodPeriodToken
    | AmpersandEqualsSignToken
    | AsteriskEqualsSignToken
    | PlusSignEqualsSignToken
    | HyphenMinusEqualsSignToken
    | SlashEqualsSignToken
    | ColonEqualsSignToken
    | LessThanSignEqualsSignToken
    | GreaterThanSignEqualsSignToken
    | VerticalBarEqualsSignToken
    | TildeEqualsSignToken
    | ShlKeywordEqualsSignToken
    | ShrKeywordEqualsSignToken
    | ModKeywordEqualsSignToken
    | LessThanSignGreaterThanSignToken
    | IdentifierToken
    | VoidKeywordToken
    | StrictKeywordToken
    | PublicKeywordToken
    | PrivateKeywordToken
    | ProtectedKeywordToken
    | FriendKeywordToken
    | PropertyKeywordToken
    | BoolKeywordToken
    | IntKeywordToken
    | FloatKeywordToken
    | StringKeywordToken
    | ArrayKeywordToken
    | ObjectKeywordToken
    | ModKeywordToken
    | ContinueKeywordToken
    | ExitKeywordToken
    | IncludeKeywordToken
    | ImportKeywordToken
    | ModuleKeywordToken
    | ExternKeywordToken
    | NewKeywordToken
    | SelfKeywordToken
    | SuperKeywordToken
    | EachInKeywordToken
    | TrueKeywordToken
    | FalseKeywordToken
    | NullKeywordToken
    | NotKeywordToken
    | ExtendsKeywordToken
    | AbstractKeywordToken
    | FinalKeywordToken
    | SelectKeywordToken
    | CaseKeywordToken
    | DefaultKeywordToken
    | ConstKeywordToken
    | LocalKeywordToken
    | GlobalKeywordToken
    | FieldKeywordToken
    | MethodKeywordToken
    | FunctionKeywordToken
    | ClassKeywordToken
    | AndKeywordToken
    | OrKeywordToken
    | ShlKeywordToken
    | ShrKeywordToken
    | EndKeywordToken
    | IfKeywordToken
    | ThenKeywordToken
    | ElseKeywordToken
    | ElseIfKeywordToken
    | EndIfKeywordToken
    | WhileKeywordToken
    | WendKeywordToken
    | RepeatKeywordToken
    | UntilKeywordToken
    | ForeverKeywordToken
    | ForKeywordToken
    | ToKeywordToken
    | StepKeywordToken
    | NextKeywordToken
    | ReturnKeywordToken
    | InterfaceKeywordToken
    | ImplementsKeywordToken
    | InlineKeywordToken
    | AliasKeywordToken
    | TryKeywordToken
    | CatchKeywordToken
    | ThrowKeywordToken
    | ThrowableKeywordToken
    ;

// #endregion

export type TokenKindToTokenMap = {
    [Kind in keyof typeof TokenKind]: Extract<Tokens, { kind: Kind; }>;
}

export type ErrorableTokenKinds =
    | TokenKind
    | TokenKind.Missing
    | MissingTokenKinds
    | TokenKind.Skipped
    ;

export type ErrorableToken =
    | Tokens
    | MissingToken
    | SkippedToken
    ;
