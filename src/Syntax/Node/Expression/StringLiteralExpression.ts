import { ParseContextElementArray } from '../../ParserBase';
import { MissableToken, MissingToken } from '../../Token/MissingToken';
import { QuotationMarkToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class StringLiteralExpression extends Expression {
    static CHILD_NAMES: (keyof StringLiteralExpression)[] = [
        'newlines',
        'startQuotationMark',
        'children',
        'endQuotationMark',
    ];

    readonly kind = NodeKind.StringLiteralExpression;

    startQuotationMark: QuotationMarkToken = undefined!;
    children: ParseContextElementArray<StringLiteralExpression['kind']> = undefined!;
    endQuotationMark: MissableToken<QuotationMarkToken> = undefined!;

    get firstToken() {
        if (this.newlines && this.newlines.length !== 0) {
            return this.newlines[0];
        }

        return this.startQuotationMark;
    }

    get lastToken() {
        return this.endQuotationMark;
    }
}

export type MissableStringLiteralExpression =
    | StringLiteralExpression
    | MissingToken<StringLiteralExpression['kind']>
    ;
