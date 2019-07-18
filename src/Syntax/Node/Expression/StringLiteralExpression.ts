import { ParseContextElementArray } from '../../ParserBase';
import { MissableToken, MissingToken } from '../../Token/MissingToken';
import { QuotationMarkToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class StringLiteralExpression extends Expression {
    readonly kind = NodeKind.StringLiteralExpression;

    startQuotationMark: QuotationMarkToken = undefined!;
    children: ParseContextElementArray<StringLiteralExpression['kind']> = undefined!;
    endQuotationMark: MissableToken<QuotationMarkToken> = undefined!;
}

export type MissableStringLiteralExpression =
    | StringLiteralExpression
    | MissingToken<StringLiteralExpression['kind']>
    ;
