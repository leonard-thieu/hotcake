import { ParseContextElementArray } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { QuotationMarkToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class StringLiteral extends Expression {
    static CHILD_NAMES: (keyof StringLiteral)[] = [
        'newlines',
        'startQuote',
        'children',
        'endQuote',
    ];

    readonly kind = NodeKind.StringLiteral;

    startQuote: QuotationMarkToken;
    children: ParseContextElementArray<StringLiteral['kind']>;
    endQuote: MissableToken<QuotationMarkToken>;
}
