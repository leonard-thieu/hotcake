import { ClosingSquareBracketToken, MissingExpressionToken, OpeningSquareBracketToken, PeriodPeriodToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, Expressions } from './Expression';

export class IndexExpression extends Expression {
    static CHILD_NAMES: (keyof IndexExpression)[] = [
        'newlines',
        'indexableExpression',
        'openingSquareBracket',
        'indexExpressionExpression',
        'startExpression',
        'sliceOperator',
        'endExpression',
        'closingSquareBracket',
    ];

    readonly kind = NodeKind.IndexExpression;

    indexableExpression: Expressions;
    openingSquareBracket: OpeningSquareBracketToken;

    indexExpressionExpression: Expressions | MissingExpressionToken | null = null;

    startExpression: Expressions | MissingExpressionToken | null = null;
    sliceOperator: PeriodPeriodToken | null = null;
    endExpression: Expressions | MissingExpressionToken | null = null;

    closingSquareBracket: ClosingSquareBracketToken;
}
