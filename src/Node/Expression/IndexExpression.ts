import { MissingToken } from '../../Token/MissingToken';
import { ClosingSquareBracketToken, OpeningSquareBracketToken, PeriodPeriodToken } from '../../Token/Token';
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

    indexExpressionExpression: Expressions | MissingToken | null = null;

    startExpression: Expressions | MissingToken | null = null;
    sliceOperator: PeriodPeriodToken | null = null;
    endExpression: Expressions | MissingToken | null = null;

    closingSquareBracket: ClosingSquareBracketToken;
}
