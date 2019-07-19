import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { MissableToken, MissingToken } from '../../Token/MissingToken';
import { QuotationMarkToken } from '../../Token/Token';
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
    children: ParseContextElementArray<ParseContextKind.StringLiteralExpression> = undefined!;
    endQuotationMark: MissableToken<QuotationMarkToken> = undefined!;
}

export type MissableStringLiteralExpression =
    | StringLiteralExpression
    | MissingToken
    ;
