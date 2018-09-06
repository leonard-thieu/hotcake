import { MissingToken } from './MissingToken';
import { TokenKind } from './TokenKind';

export class Token<TTokenKind extends TokenKinds> {
    constructor(
        public kind: TTokenKind,
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

export interface UnknownToken extends Token<TokenKind.Unknown> { }
export interface EOFToken extends Token<TokenKind.EOF> { }
export interface NewlineToken extends Token<TokenKind.Newline> { }
export interface IntegerLiteralToken extends Token<TokenKind.IntegerLiteral> { }
export interface FloatLiteralToken extends Token<TokenKind.FloatLiteral> { }
export interface StringLiteralTextToken extends Token<TokenKind.StringLiteralText> { }
export interface EscapeNullToken extends Token<TokenKind.EscapeNull> { }
export interface EscapeCharacterTabulationToken extends Token<TokenKind.EscapeCharacterTabulation> { }
export interface EscapeLineFeedLfToken extends Token<TokenKind.EscapeLineFeedLf> { }
export interface EscapeCarriageReturnCrToken extends Token<TokenKind.EscapeCarriageReturnCr> { }
export interface EscapeQuotationMarkToken extends Token<TokenKind.EscapeQuotationMark> { }
export interface EscapeTildeToken extends Token<TokenKind.EscapeTilde> { }
export interface EscapeUnicodeHexValueToken extends Token<TokenKind.EscapeUnicodeHexValue> { }
export interface InvalidEscapeSequenceToken extends Token<TokenKind.InvalidEscapeSequence> { }
export interface ConfigurationTagStartToken extends Token<TokenKind.ConfigurationTagStart> { }
export interface ConfigurationTagEndToken extends Token<TokenKind.ConfigurationTagEnd> { }
export interface IfDirectiveKeywordToken extends Token<TokenKind.IfDirectiveKeyword> { }
export interface ElseIfDirectiveKeywordToken extends Token<TokenKind.ElseIfDirectiveKeyword> { }
export interface ElseDirectiveKeywordToken extends Token<TokenKind.ElseDirectiveKeyword> { }
export interface EndDirectiveKeywordToken extends Token<TokenKind.EndDirectiveKeyword> { }
export interface RemDirectiveKeywordToken extends Token<TokenKind.RemDirectiveKeyword> { }
export interface RemDirectiveBodyToken extends Token<TokenKind.RemDirectiveBody> { }
export interface PrintDirectiveKeywordToken extends Token<TokenKind.PrintDirectiveKeyword> { }
export interface ErrorDirectiveKeywordToken extends Token<TokenKind.ErrorDirectiveKeyword> { }
export interface ConfigurationVariableToken extends Token<TokenKind.ConfigurationVariable> { }
export interface QuotationMarkToken extends Token<TokenKind.QuotationMark> { }
export interface NumberSignToken extends Token<TokenKind.NumberSign> { }
export interface DollarSignToken extends Token<TokenKind.DollarSign> { }
export interface PercentSignToken extends Token<TokenKind.PercentSign> { }
export interface AmpersandToken extends Token<TokenKind.Ampersand> { }
export interface OpeningParenthesisToken extends Token<TokenKind.OpeningParenthesis> { }
export interface ClosingParenthesisToken extends Token<TokenKind.ClosingParenthesis> { }
export interface AsteriskToken extends Token<TokenKind.Asterisk> { }
export interface PlusSignToken extends Token<TokenKind.PlusSign> { }
export interface CommaToken extends Token<TokenKind.Comma> { }
export interface HyphenMinusToken extends Token<TokenKind.HyphenMinus> { }
export interface PeriodToken extends Token<TokenKind.Period> { }
export interface SlashToken extends Token<TokenKind.Slash> { }
export interface ColonToken extends Token<TokenKind.Colon> { }
export interface SemicolonToken extends Token<TokenKind.Semicolon> { }
export interface LessThanSignToken extends Token<TokenKind.LessThanSign> { }
export interface EqualsSignToken extends Token<TokenKind.EqualsSign> { }
export interface GreaterThanSignToken extends Token<TokenKind.GreaterThanSign> { }
export interface QuestionMarkToken extends Token<TokenKind.QuestionMark> { }
export interface CommercialAtToken extends Token<TokenKind.CommercialAt> { }
export interface OpeningSquareBracketToken extends Token<TokenKind.OpeningSquareBracket> { }
export interface ClosingSquareBracketToken extends Token<TokenKind.ClosingSquareBracket> { }
export interface VerticalBarToken extends Token<TokenKind.VerticalBar> { }
export interface TildeToken extends Token<TokenKind.Tilde> { }
export interface PeriodPeriodToken extends Token<TokenKind.PeriodPeriod> { }
export interface AmpersandEqualsSignToken extends Token<TokenKind.AmpersandEqualsSign> { }
export interface AsteriskEqualsSignToken extends Token<TokenKind.AsteriskEqualsSign> { }
export interface PlusSignEqualsSignToken extends Token<TokenKind.PlusSignEqualsSign> { }
export interface HyphenMinusEqualsSignToken extends Token<TokenKind.HyphenMinusEqualsSign> { }
export interface SlashEqualsSignToken extends Token<TokenKind.SlashEqualsSign> { }
export interface ColonEqualsSignToken extends Token<TokenKind.ColonEqualsSign> { }
export interface LessThanSignEqualsSignToken extends Token<TokenKind.LessThanSignEqualsSign> { }
export interface GreaterThanSignEqualsSignToken extends Token<TokenKind.GreaterThanSignEqualsSign> { }
export interface VerticalBarEqualsSignToken extends Token<TokenKind.VerticalBarEqualsSign> { }
export interface TildeEqualsSignToken extends Token<TokenKind.TildeEqualsSign> { }
export interface ShlKeywordEqualsSignToken extends Token<TokenKind.ShlKeywordEqualsSign> { }
export interface ShrKeywordEqualsSignToken extends Token<TokenKind.ShrKeywordEqualsSign> { }
export interface ModKeywordEqualsSignToken extends Token<TokenKind.ModKeywordEqualsSign> { }
export interface LessThanSignGreaterThanSignToken extends Token<TokenKind.LessThanSignGreaterThanSign> { }
export interface IdentifierToken extends Token<TokenKind.Identifier> { }
export interface VoidKeywordToken extends Token<TokenKind.VoidKeyword> { }
export interface StrictKeywordToken extends Token<TokenKind.StrictKeyword> { }
export interface PublicKeywordToken extends Token<TokenKind.PublicKeyword> { }
export interface PrivateKeywordToken extends Token<TokenKind.PrivateKeyword> { }
export interface ProtectedKeywordToken extends Token<TokenKind.ProtectedKeyword> { }
export interface FriendKeywordToken extends Token<TokenKind.FriendKeyword> { }
export interface PropertyKeywordToken extends Token<TokenKind.PropertyKeyword> { }
export interface BoolKeywordToken extends Token<TokenKind.BoolKeyword> { }
export interface IntKeywordToken extends Token<TokenKind.IntKeyword> { }
export interface FloatKeywordToken extends Token<TokenKind.FloatKeyword> { }
export interface StringKeywordToken extends Token<TokenKind.StringKeyword> { }
export interface ArrayKeywordToken extends Token<TokenKind.ArrayKeyword> { }
export interface ObjectKeywordToken extends Token<TokenKind.ObjectKeyword> { }
export interface ModKeywordToken extends Token<TokenKind.ModKeyword> { }
export interface ContinueKeywordToken extends Token<TokenKind.ContinueKeyword> { }
export interface ExitKeywordToken extends Token<TokenKind.ExitKeyword> { }
export interface IncludeKeywordToken extends Token<TokenKind.IncludeKeyword> { }
export interface ImportKeywordToken extends Token<TokenKind.ImportKeyword> { }
export interface ModuleKeywordToken extends Token<TokenKind.ModuleKeyword> { }
export interface ExternKeywordToken extends Token<TokenKind.ExternKeyword> { }
export interface NewKeywordToken extends Token<TokenKind.NewKeyword> { }
export interface SelfKeywordToken extends Token<TokenKind.SelfKeyword> { }
export interface SuperKeywordToken extends Token<TokenKind.SuperKeyword> { }
export interface EachInKeywordToken extends Token<TokenKind.EachInKeyword> { }
export interface TrueKeywordToken extends Token<TokenKind.TrueKeyword> { }
export interface FalseKeywordToken extends Token<TokenKind.FalseKeyword> { }
export interface NullKeywordToken extends Token<TokenKind.NullKeyword> { }
export interface NotKeywordToken extends Token<TokenKind.NotKeyword> { }
export interface ExtendsKeywordToken extends Token<TokenKind.ExtendsKeyword> { }
export interface AbstractKeywordToken extends Token<TokenKind.AbstractKeyword> { }
export interface FinalKeywordToken extends Token<TokenKind.FinalKeyword> { }
export interface SelectKeywordToken extends Token<TokenKind.SelectKeyword> { }
export interface CaseKeywordToken extends Token<TokenKind.CaseKeyword> { }
export interface DefaultKeywordToken extends Token<TokenKind.DefaultKeyword> { }
export interface ConstKeywordToken extends Token<TokenKind.ConstKeyword> { }
export interface LocalKeywordToken extends Token<TokenKind.LocalKeyword> { }
export interface GlobalKeywordToken extends Token<TokenKind.GlobalKeyword> { }
export interface FieldKeywordToken extends Token<TokenKind.FieldKeyword> { }
export interface MethodKeywordToken extends Token<TokenKind.MethodKeyword> { }
export interface FunctionKeywordToken extends Token<TokenKind.FunctionKeyword> { }
export interface ClassKeywordToken extends Token<TokenKind.ClassKeyword> { }
export interface AndKeywordToken extends Token<TokenKind.AndKeyword> { }
export interface OrKeywordToken extends Token<TokenKind.OrKeyword> { }
export interface ShlKeywordToken extends Token<TokenKind.ShlKeyword> { }
export interface ShrKeywordToken extends Token<TokenKind.ShrKeyword> { }
export interface EndKeywordToken extends Token<TokenKind.EndKeyword> { }
export interface IfKeywordToken extends Token<TokenKind.IfKeyword> { }
export interface ThenKeywordToken extends Token<TokenKind.ThenKeyword> { }
export interface ElseKeywordToken extends Token<TokenKind.ElseKeyword> { }
export interface ElseIfKeywordToken extends Token<TokenKind.ElseIfKeyword> { }
export interface EndIfKeywordToken extends Token<TokenKind.EndIfKeyword> { }
export interface WhileKeywordToken extends Token<TokenKind.WhileKeyword> { }
export interface WendKeywordToken extends Token<TokenKind.WendKeyword> { }
export interface RepeatKeywordToken extends Token<TokenKind.RepeatKeyword> { }
export interface UntilKeywordToken extends Token<TokenKind.UntilKeyword> { }
export interface ForeverKeywordToken extends Token<TokenKind.ForeverKeyword> { }
export interface ForKeywordToken extends Token<TokenKind.ForKeyword> { }
export interface ToKeywordToken extends Token<TokenKind.ToKeyword> { }
export interface StepKeywordToken extends Token<TokenKind.StepKeyword> { }
export interface NextKeywordToken extends Token<TokenKind.NextKeyword> { }
export interface ReturnKeywordToken extends Token<TokenKind.ReturnKeyword> { }
export interface InterfaceKeywordToken extends Token<TokenKind.InterfaceKeyword> { }
export interface ImplementsKeywordToken extends Token<TokenKind.ImplementsKeyword> { }
export interface InlineKeywordToken extends Token<TokenKind.InlineKeyword> { }
export interface AliasKeywordToken extends Token<TokenKind.AliasKeyword> { }
export interface TryKeywordToken extends Token<TokenKind.TryKeyword> { }
export interface CatchKeywordToken extends Token<TokenKind.CatchKeyword> { }
export interface ThrowKeywordToken extends Token<TokenKind.ThrowKeyword> { }
export interface ThrowableKeywordToken extends Token<TokenKind.ThrowableKeyword> { }
export interface MissingExpressionToken extends MissingToken<TokenKind.Expression> { }

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
    [TokenKind.Expression]: MissingExpressionToken;
    [TokenKind.GreaterThanSignEqualsSign]: GreaterThanSignEqualsSignToken;
}

export type TokenKinds = keyof TokenKindTokenMap;
export type Tokens = TokenKindTokenMap[TokenKinds];
