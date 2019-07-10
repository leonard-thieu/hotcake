import { MissableTokenKinds, MissingToken } from './MissingToken';
import { SkippedToken } from './SkippedToken';
import { TokenKind } from './TokenKind';

export class Token<TTokenKind extends ErrorableTokenKinds> {
    constructor(
        public kind: TTokenKind,
        public fullStart: number,
        public start: number,
        public length: number) { }

    get end() {
        return this.fullStart + this.length;
    }

    getFullText(document: string): string {
        return document.slice(this.fullStart, this.fullStart + this.length);
    }

    getText(document: string): string {
        return document.slice(this.start, this.fullStart + this.length);
    }

    toJSON(): any {
        return this;
    }
}

// #region Tokens

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

// #endregion

export interface TokenKindTokenMap {
    [TokenKind.Unknown]: UnknownToken;
    [TokenKind.EOF]: EOFToken;
    [TokenKind.Newline]: NewlineToken;
    [TokenKind.IntegerLiteral]: IntegerLiteralToken;
    [TokenKind.FloatLiteral]: FloatLiteralToken;
    [TokenKind.StringLiteralText]: StringLiteralTextToken;
    [TokenKind.EscapeNull]: EscapeNullToken;
    [TokenKind.EscapeCharacterTabulation]: EscapeCharacterTabulationToken;
    [TokenKind.EscapeLineFeedLf]: EscapeLineFeedLfToken;
    [TokenKind.EscapeCarriageReturnCr]: EscapeCarriageReturnCrToken;
    [TokenKind.EscapeQuotationMark]: EscapeQuotationMarkToken;
    [TokenKind.EscapeTilde]: EscapeTildeToken;
    [TokenKind.EscapeUnicodeHexValue]: EscapeUnicodeHexValueToken;
    [TokenKind.InvalidEscapeSequence]: InvalidEscapeSequenceToken;
    [TokenKind.ConfigurationTagStart]: ConfigurationTagStartToken;
    [TokenKind.ConfigurationTagEnd]: ConfigurationTagEndToken;
    [TokenKind.IfDirectiveKeyword]: IfDirectiveKeywordToken;
    [TokenKind.ElseIfDirectiveKeyword]: ElseIfDirectiveKeywordToken;
    [TokenKind.ElseDirectiveKeyword]: ElseDirectiveKeywordToken;
    [TokenKind.EndDirectiveKeyword]: EndDirectiveKeywordToken;
    [TokenKind.RemDirectiveKeyword]: RemDirectiveKeywordToken;
    [TokenKind.RemDirectiveBody]: RemDirectiveBodyToken;
    [TokenKind.PrintDirectiveKeyword]: PrintDirectiveKeywordToken;
    [TokenKind.ErrorDirectiveKeyword]: ErrorDirectiveKeywordToken;
    [TokenKind.ConfigurationVariable]: ConfigurationVariableToken;
    [TokenKind.QuotationMark]: QuotationMarkToken;
    [TokenKind.NumberSign]: NumberSignToken;
    [TokenKind.DollarSign]: DollarSignToken;
    [TokenKind.PercentSign]: PercentSignToken;
    [TokenKind.Ampersand]: AmpersandToken;
    [TokenKind.OpeningParenthesis]: OpeningParenthesisToken;
    [TokenKind.ClosingParenthesis]: ClosingParenthesisToken;
    [TokenKind.Asterisk]: AsteriskToken;
    [TokenKind.PlusSign]: PlusSignToken;
    [TokenKind.Comma]: CommaToken;
    [TokenKind.HyphenMinus]: HyphenMinusToken;
    [TokenKind.Period]: PeriodToken;
    [TokenKind.Slash]: SlashToken;
    [TokenKind.Colon]: ColonToken;
    [TokenKind.Semicolon]: SemicolonToken;
    [TokenKind.LessThanSign]: LessThanSignToken;
    [TokenKind.EqualsSign]: EqualsSignToken;
    [TokenKind.GreaterThanSign]: GreaterThanSignToken;
    [TokenKind.QuestionMark]: QuestionMarkToken;
    [TokenKind.CommercialAt]: CommercialAtToken;
    [TokenKind.OpeningSquareBracket]: OpeningSquareBracketToken;
    [TokenKind.ClosingSquareBracket]: ClosingSquareBracketToken;
    [TokenKind.VerticalBar]: VerticalBarToken;
    [TokenKind.Tilde]: TildeToken;
    [TokenKind.PeriodPeriod]: PeriodPeriodToken;
    [TokenKind.AmpersandEqualsSign]: AmpersandEqualsSignToken;
    [TokenKind.AsteriskEqualsSign]: AsteriskEqualsSignToken;
    [TokenKind.PlusSignEqualsSign]: PlusSignEqualsSignToken;
    [TokenKind.HyphenMinusEqualsSign]: HyphenMinusEqualsSignToken;
    [TokenKind.SlashEqualsSign]: SlashEqualsSignToken;
    [TokenKind.ColonEqualsSign]: ColonEqualsSignToken;
    [TokenKind.LessThanSignEqualsSign]: LessThanSignEqualsSignToken;
    [TokenKind.GreaterThanSignEqualsSign]: GreaterThanSignEqualsSignToken;
    [TokenKind.VerticalBarEqualsSign]: VerticalBarEqualsSignToken;
    [TokenKind.TildeEqualsSign]: TildeEqualsSignToken;
    [TokenKind.ShlKeywordEqualsSign]: ShlKeywordEqualsSignToken;
    [TokenKind.ShrKeywordEqualsSign]: ShrKeywordEqualsSignToken;
    [TokenKind.ModKeywordEqualsSign]: ModKeywordEqualsSignToken;
    [TokenKind.LessThanSignGreaterThanSign]: LessThanSignGreaterThanSignToken;
    [TokenKind.Identifier]: IdentifierToken;
    [TokenKind.VoidKeyword]: VoidKeywordToken;
    [TokenKind.StrictKeyword]: StrictKeywordToken;
    [TokenKind.PublicKeyword]: PublicKeywordToken;
    [TokenKind.PrivateKeyword]: PrivateKeywordToken;
    [TokenKind.ProtectedKeyword]: ProtectedKeywordToken;
    [TokenKind.FriendKeyword]: FriendKeywordToken;
    [TokenKind.PropertyKeyword]: PropertyKeywordToken;
    [TokenKind.BoolKeyword]: BoolKeywordToken;
    [TokenKind.IntKeyword]: IntKeywordToken;
    [TokenKind.FloatKeyword]: FloatKeywordToken;
    [TokenKind.StringKeyword]: StringKeywordToken;
    [TokenKind.ArrayKeyword]: ArrayKeywordToken;
    [TokenKind.ObjectKeyword]: ObjectKeywordToken;
    [TokenKind.ModKeyword]: ModKeywordToken;
    [TokenKind.ContinueKeyword]: ContinueKeywordToken;
    [TokenKind.ExitKeyword]: ExitKeywordToken;
    [TokenKind.IncludeKeyword]: IncludeKeywordToken;
    [TokenKind.ImportKeyword]: ImportKeywordToken;
    [TokenKind.ModuleKeyword]: ModuleKeywordToken;
    [TokenKind.ExternKeyword]: ExternKeywordToken;
    [TokenKind.NewKeyword]: NewKeywordToken;
    [TokenKind.SelfKeyword]: SelfKeywordToken;
    [TokenKind.SuperKeyword]: SuperKeywordToken;
    [TokenKind.EachInKeyword]: EachInKeywordToken;
    [TokenKind.TrueKeyword]: TrueKeywordToken;
    [TokenKind.FalseKeyword]: FalseKeywordToken;
    [TokenKind.NullKeyword]: NullKeywordToken;
    [TokenKind.NotKeyword]: NotKeywordToken;
    [TokenKind.ExtendsKeyword]: ExtendsKeywordToken;
    [TokenKind.AbstractKeyword]: AbstractKeywordToken;
    [TokenKind.FinalKeyword]: FinalKeywordToken;
    [TokenKind.SelectKeyword]: SelectKeywordToken;
    [TokenKind.CaseKeyword]: CaseKeywordToken;
    [TokenKind.DefaultKeyword]: DefaultKeywordToken;
    [TokenKind.ConstKeyword]: ConstKeywordToken;
    [TokenKind.LocalKeyword]: LocalKeywordToken;
    [TokenKind.GlobalKeyword]: GlobalKeywordToken;
    [TokenKind.FieldKeyword]: FieldKeywordToken;
    [TokenKind.MethodKeyword]: MethodKeywordToken;
    [TokenKind.FunctionKeyword]: FunctionKeywordToken;
    [TokenKind.ClassKeyword]: ClassKeywordToken;
    [TokenKind.AndKeyword]: AndKeywordToken;
    [TokenKind.OrKeyword]: OrKeywordToken;
    [TokenKind.ShlKeyword]: ShlKeywordToken;
    [TokenKind.ShrKeyword]: ShrKeywordToken;
    [TokenKind.EndKeyword]: EndKeywordToken;
    [TokenKind.IfKeyword]: IfKeywordToken;
    [TokenKind.ThenKeyword]: ThenKeywordToken;
    [TokenKind.ElseKeyword]: ElseKeywordToken;
    [TokenKind.ElseIfKeyword]: ElseIfKeywordToken;
    [TokenKind.EndIfKeyword]: EndIfKeywordToken;
    [TokenKind.WhileKeyword]: WhileKeywordToken;
    [TokenKind.WendKeyword]: WendKeywordToken;
    [TokenKind.RepeatKeyword]: RepeatKeywordToken;
    [TokenKind.UntilKeyword]: UntilKeywordToken;
    [TokenKind.ForeverKeyword]: ForeverKeywordToken;
    [TokenKind.ForKeyword]: ForKeywordToken;
    [TokenKind.ToKeyword]: ToKeywordToken;
    [TokenKind.StepKeyword]: StepKeywordToken;
    [TokenKind.NextKeyword]: NextKeywordToken;
    [TokenKind.ReturnKeyword]: ReturnKeywordToken;
    [TokenKind.InterfaceKeyword]: InterfaceKeywordToken;
    [TokenKind.ImplementsKeyword]: ImplementsKeywordToken;
    [TokenKind.InlineKeyword]: InlineKeywordToken;
    [TokenKind.AliasKeyword]: AliasKeywordToken;
    [TokenKind.TryKeyword]: TryKeywordToken;
    [TokenKind.CatchKeyword]: CatchKeywordToken;
    [TokenKind.ThrowKeyword]: ThrowKeywordToken;
    [TokenKind.ThrowableKeyword]: ThrowableKeywordToken;
}

export type TokenKinds = keyof TokenKindTokenMap;
export type Tokens = TokenKindTokenMap[TokenKinds];

export type ErrorableTokenKinds =
    TokenKinds |
    TokenKind.Missing |
    MissableTokenKinds |
    TokenKind.Skipped
    ;
export type ErrorableToken =
    Tokens |
    MissingToken<MissableTokenKinds> |
    SkippedToken<TokenKinds>
    ;
