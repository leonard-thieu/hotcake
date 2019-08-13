import { MissingToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { ConfigurationTagEndToken, ConfigurationTagStartToken, EscapeCarriageReturnCrToken, EscapeCharacterTabulationToken, EscapeLineFeedLfToken, EscapeNullToken, EscapeQuotationMarkToken, EscapeTildeToken, EscapeUnicodeHexValueToken, IdentifierToken, InvalidEscapeSequenceToken, QuotationMarkToken, StringLiteralTextToken } from '../../Token/Tokens';
import { Node, NodeKind } from '../Nodes';
import { Expression } from './Expressions';

// #region String literal expression

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
    endQuotationMark: QuotationMarkToken | MissingToken = undefined!;
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

// #endregion

// #region Configuration tag

export const ConfigurationTagChildNames: ReadonlyArray<keyof ConfigurationTag> = [
    'startToken',
    'name',
    'endToken',
];

export class ConfigurationTag extends Node {
    readonly kind = NodeKind.ConfigurationTag;

    startToken: ConfigurationTagStartToken = undefined!;
    name?: IdentifierToken = undefined;
    endToken: ConfigurationTagEndToken = undefined!;
}

// #endregion
