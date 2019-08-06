import { MissableToken, MissingToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { EscapeCarriageReturnCrToken, EscapeCharacterTabulationToken, EscapeLineFeedLfToken, EscapeNullToken, EscapeQuotationMarkToken, EscapeTildeToken, EscapeUnicodeHexValueToken, InvalidEscapeSequenceToken, QuotationMarkToken, StringLiteralTextToken } from '../../Token/Tokens';
import { ConfigurationTag } from '../ConfigurationTag';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export const StringLiteralExpressionChildNames: ReadonlyArray<keyof StringLiteralExpression> = [
    'newlines',
    'startQuotationMark',
    'children',
    'endQuotationMark',
];

export class StringLiteralExpression extends Expression {
    readonly kind = NodeKind.StringLiteralExpression;

    startQuotationMark: QuotationMarkToken = undefined!;
    children: (StringLiteralExpressionChild | SkippedToken)[] = undefined!;
    endQuotationMark: MissableToken<QuotationMarkToken> = undefined!;
}

export type StringLiteralExpressionChild =
    | StringLiteralTextToken
    | EscapeNullToken
    | EscapeCharacterTabulationToken
    | EscapeLineFeedLfToken
    | EscapeCarriageReturnCrToken
    | EscapeQuotationMarkToken
    | EscapeTildeToken
    | EscapeUnicodeHexValueToken
    | InvalidEscapeSequenceToken
    | ConfigurationTag
    ;

export type MissableStringLiteralExpression =
    | StringLiteralExpression
    | MissingToken
    ;
