import { ClosingSquareBracketToken, MissingExpressionToken, OpeningSquareBracketToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, Expressions } from './Expression';

export class IndexExpression extends Expression {
    static CHILD_NAMES: (keyof IndexExpression)[] = [
        'newlines',
        'indexableExpression',
        'openingSquareBracket',
        'indexExpressionExpression',
        'closingSquareBracket',
    ];

    readonly kind = NodeKind.IndexExpression;

    indexableExpression: Expressions;
    openingSquareBracket: OpeningSquareBracketToken;
    indexExpressionExpression: Expressions | MissingExpressionToken;
    closingSquareBracket: ClosingSquareBracketToken;
}
