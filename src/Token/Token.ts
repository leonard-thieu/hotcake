import { TokenKind } from './TokenKind';

export class Token {
    constructor(
        public kind: TokenKinds,
        public fullStart: number,
        public start: number,
        public length: number) { }

    getFullText(document: string): string {
        return document.slice(this.fullStart, this.fullStart + this.length);
    }

    getText(document: string): string {
        return document.slice(this.start, this.fullStart + this.length);
    }
}

export interface UnknownToken extends Token { kind: TokenKind.Unknown; }
export interface EOFToken extends Token { kind: TokenKind.EOF; }
export interface NewlineToken extends Token { kind: TokenKind.Newline; }
export interface IntegerLiteralToken extends Token { kind: TokenKind.IntegerLiteral; }
export interface FloatLiteralToken extends Token { kind: TokenKind.FloatLiteral; }
export interface StringLiteralTextToken extends Token { kind: TokenKind.StringLiteralText; }
export interface EscapeNullToken extends Token { kind: TokenKind.EscapeNull; }
export interface EscapeCharacterTabulationToken extends Token { kind: TokenKind.EscapeCharacterTabulation; }
export interface EscapeLineFeedLfToken extends Token { kind: TokenKind.EscapeLineFeedLf; }
export interface EscapeCarriageReturnCrToken extends Token { kind: TokenKind.EscapeCarriageReturnCr; }
export interface EscapeQuotationMarkToken extends Token { kind: TokenKind.EscapeQuotationMark; }
export interface EscapeTildeToken extends Token { kind: TokenKind.EscapeTilde; }
export interface EscapeUnicodeHexValueToken extends Token { kind: TokenKind.EscapeUnicodeHexValue; }
export interface InvalidEscapeSequenceToken extends Token { kind: TokenKind.InvalidEscapeSequence; }
export interface IfDirectiveKeywordToken extends Token { kind: TokenKind.IfDirectiveKeyword; }
export interface ElseIfDirectiveKeywordToken extends Token { kind: TokenKind.ElseIfDirectiveKeyword; }
export interface ElseDirectiveKeywordToken extends Token { kind: TokenKind.ElseDirectiveKeyword; }
export interface EndDirectiveKeywordToken extends Token { kind: TokenKind.EndDirectiveKeyword; }
export interface RemDirectiveKeywordToken extends Token { kind: TokenKind.RemDirectiveKeyword; }
export interface RemDirectiveBodyToken extends Token { kind: TokenKind.RemDirectiveBody; }
export interface PrintDirectiveKeywordToken extends Token { kind: TokenKind.PrintDirectiveKeyword; }
export interface ErrorDirectiveKeywordToken extends Token { kind: TokenKind.ErrorDirectiveKeyword; }
export interface ConfigurationVariableToken extends Token { kind: TokenKind.ConfigurationVariable; }
export interface QuotationMarkToken extends Token { kind: TokenKind.QuotationMark; }
export interface NumberSignToken extends Token { kind: TokenKind.NumberSign; }
export interface DollarSignToken extends Token { kind: TokenKind.DollarSign; }
export interface PercentSignToken extends Token { kind: TokenKind.PercentSign; }
export interface AmpersandToken extends Token { kind: TokenKind.Ampersand; }
export interface OpeningParenthesisToken extends Token { kind: TokenKind.OpeningParenthesis; }
export interface ClosingParenthesisToken extends Token { kind: TokenKind.ClosingParenthesis; }
export interface AsteriskToken extends Token { kind: TokenKind.Asterisk; }
export interface PlusSignToken extends Token { kind: TokenKind.PlusSign; }
export interface CommaToken extends Token { kind: TokenKind.Comma; }
export interface HyphenMinusToken extends Token { kind: TokenKind.HyphenMinus; }
export interface PeriodToken extends Token { kind: TokenKind.Period; }
export interface SlashToken extends Token { kind: TokenKind.Slash; }
export interface ColonToken extends Token { kind: TokenKind.Colon; }
export interface SemicolonToken extends Token { kind: TokenKind.Semicolon; }
export interface LessThanSignToken extends Token { kind: TokenKind.LessThanSign; }
export interface EqualsSignToken extends Token { kind: TokenKind.EqualsSign; }
export interface GreaterThanSignToken extends Token { kind: TokenKind.GreaterThanSign; }
export interface QuestionMarkToken extends Token { kind: TokenKind.QuestionMark; }
export interface CommercialAtToken extends Token { kind: TokenKind.CommercialAt; }
export interface OpeningSquareBracketToken extends Token { kind: TokenKind.OpeningSquareBracket; }
export interface ClosingSquareBracketToken extends Token { kind: TokenKind.ClosingSquareBracket; }
export interface VerticalBarToken extends Token { kind: TokenKind.VerticalBar; }
export interface TildeToken extends Token { kind: TokenKind.Tilde; }
export interface PeriodPeriodToken extends Token { kind: TokenKind.PeriodPeriod; }
export interface AmpersandEqualsSignToken extends Token { kind: TokenKind.AmpersandEqualsSign; }
export interface AsteriskEqualsSignToken extends Token { kind: TokenKind.AsteriskEqualsSign; }
export interface PlusSignEqualsSignToken extends Token { kind: TokenKind.PlusSignEqualsSign; }
export interface HyphenMinusEqualsSignToken extends Token { kind: TokenKind.HyphenMinusEqualsSign; }
export interface SlashEqualsSignToken extends Token { kind: TokenKind.SlashEqualsSign; }
export interface ColonEqualsSignToken extends Token { kind: TokenKind.ColonEqualsSign; }
export interface LessThanSignEqualsSignToken extends Token { kind: TokenKind.LessThanSignEqualsSign; }
export interface GreaterThanSignEqualsSignToken extends Token { kind: TokenKind.GreaterThanSignEqualsSign; }
export interface VerticalBarEqualsSignToken extends Token { kind: TokenKind.VerticalBarEqualsSign; }
export interface TildeEqualsSignToken extends Token { kind: TokenKind.TildeEqualsSign; }
export interface LessThanSignGreaterThanSignToken extends Token { kind: TokenKind.LessThanSignGreaterThanSign; }
export interface IdentifierToken extends Token { kind: TokenKind.Identifier; }
export interface VoidKeywordToken extends Token { kind: TokenKind.VoidKeyword; }
export interface StrictKeywordToken extends Token { kind: TokenKind.StrictKeyword; }
export interface PublicKeywordToken extends Token { kind: TokenKind.PublicKeyword; }
export interface PrivateKeywordToken extends Token { kind: TokenKind.PrivateKeyword; }
export interface ProtectedKeywordToken extends Token { kind: TokenKind.ProtectedKeyword; }
export interface FriendKeywordToken extends Token { kind: TokenKind.FriendKeyword; }
export interface PropertyKeywordToken extends Token { kind: TokenKind.PropertyKeyword; }
export interface BoolKeywordToken extends Token { kind: TokenKind.BoolKeyword; }
export interface IntKeywordToken extends Token { kind: TokenKind.IntKeyword; }
export interface FloatKeywordToken extends Token { kind: TokenKind.FloatKeyword; }
export interface StringKeywordToken extends Token { kind: TokenKind.StringKeyword; }
export interface ArrayKeywordToken extends Token { kind: TokenKind.ArrayKeyword; }
export interface ObjectKeywordToken extends Token { kind: TokenKind.ObjectKeyword; }
export interface ModKeywordToken extends Token { kind: TokenKind.ModKeyword; }
export interface ContinueKeywordToken extends Token { kind: TokenKind.ContinueKeyword; }
export interface ExitKeywordToken extends Token { kind: TokenKind.ExitKeyword; }
export interface IncludeKeywordToken extends Token { kind: TokenKind.IncludeKeyword; }
export interface ImportKeywordToken extends Token { kind: TokenKind.ImportKeyword; }
export interface ModuleKeywordToken extends Token { kind: TokenKind.ModuleKeyword; }
export interface ExternKeywordToken extends Token { kind: TokenKind.ExternKeyword; }
export interface NewKeywordToken extends Token { kind: TokenKind.NewKeyword; }
export interface SelfKeywordToken extends Token { kind: TokenKind.SelfKeyword; }
export interface SuperKeywordToken extends Token { kind: TokenKind.SuperKeyword; }
export interface EachInKeywordToken extends Token { kind: TokenKind.EachInKeyword; }
export interface TrueKeywordToken extends Token { kind: TokenKind.TrueKeyword; }
export interface FalseKeywordToken extends Token { kind: TokenKind.FalseKeyword; }
export interface NullKeywordToken extends Token { kind: TokenKind.NullKeyword; }
export interface NotKeywordToken extends Token { kind: TokenKind.NotKeyword; }
export interface ExtendsKeywordToken extends Token { kind: TokenKind.ExtendsKeyword; }
export interface AbstractKeywordToken extends Token { kind: TokenKind.AbstractKeyword; }
export interface FinalKeywordToken extends Token { kind: TokenKind.FinalKeyword; }
export interface SelectKeywordToken extends Token { kind: TokenKind.SelectKeyword; }
export interface CaseKeywordToken extends Token { kind: TokenKind.CaseKeyword; }
export interface DefaultKeywordToken extends Token { kind: TokenKind.DefaultKeyword; }
export interface ConstKeywordToken extends Token { kind: TokenKind.ConstKeyword; }
export interface LocalKeywordToken extends Token { kind: TokenKind.LocalKeyword; }
export interface GlobalKeywordToken extends Token { kind: TokenKind.GlobalKeyword; }
export interface FieldKeywordToken extends Token { kind: TokenKind.FieldKeyword; }
export interface MethodKeywordToken extends Token { kind: TokenKind.MethodKeyword; }
export interface FunctionKeywordToken extends Token { kind: TokenKind.FunctionKeyword; }
export interface ClassKeywordToken extends Token { kind: TokenKind.ClassKeyword; }
export interface AndKeywordToken extends Token { kind: TokenKind.AndKeyword; }
export interface OrKeywordToken extends Token { kind: TokenKind.OrKeyword; }
export interface ShlKeywordToken extends Token { kind: TokenKind.ShlKeyword; }
export interface ShrKeywordToken extends Token { kind: TokenKind.ShrKeyword; }
export interface EndKeywordToken extends Token { kind: TokenKind.EndKeyword; }
export interface IfKeywordToken extends Token { kind: TokenKind.IfKeyword; }
export interface ThenKeywordToken extends Token { kind: TokenKind.ThenKeyword; }
export interface ElseKeywordToken extends Token { kind: TokenKind.ElseKeyword; }
export interface ElseIfKeywordToken extends Token { kind: TokenKind.ElseIfKeyword; }
export interface EndIfKeywordToken extends Token { kind: TokenKind.EndIfKeyword; }
export interface WhileKeywordToken extends Token { kind: TokenKind.WhileKeyword; }
export interface WendKeywordToken extends Token { kind: TokenKind.WendKeyword; }
export interface RepeatKeywordToken extends Token { kind: TokenKind.RepeatKeyword; }
export interface UntilKeywordToken extends Token { kind: TokenKind.UntilKeyword; }
export interface ForeverKeywordToken extends Token { kind: TokenKind.ForeverKeyword; }
export interface ForKeywordToken extends Token { kind: TokenKind.ForKeyword; }
export interface ToKeywordToken extends Token { kind: TokenKind.ToKeyword; }
export interface StepKeywordToken extends Token { kind: TokenKind.StepKeyword; }
export interface NextKeywordToken extends Token { kind: TokenKind.NextKeyword; }
export interface ReturnKeywordToken extends Token { kind: TokenKind.ReturnKeyword; }
export interface InterfaceKeywordToken extends Token { kind: TokenKind.InterfaceKeyword; }
export interface ImplementsKeywordToken extends Token { kind: TokenKind.ImplementsKeyword; }
export interface InlineKeywordToken extends Token { kind: TokenKind.InlineKeyword; }
export interface AliasKeywordToken extends Token { kind: TokenKind.AliasKeyword; }
export interface TryKeywordToken extends Token { kind: TokenKind.TryKeyword; }
export interface CatchKeywordToken extends Token { kind: TokenKind.CatchKeyword; }
export interface ThrowKeywordToken extends Token { kind: TokenKind.ThrowKeyword; }
export interface ThrowableKeywordToken extends Token { kind: TokenKind.ThrowableKeyword; }
export interface ExpressionToken extends Token { kind: TokenKind.Expression; }

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
    [TokenKind.Expression]: ExpressionToken;
    [TokenKind.GreaterThanSignEqualsSign]: GreaterThanSignEqualsSignToken;
}

export type TokenKinds = keyof TokenKindTokenMap;
export type Tokens = TokenKindTokenMap[TokenKinds];
