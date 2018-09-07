import { MissableToken } from '../../Token/MissingToken';
import { ClosingSquareBracketToken, OpeningSquareBracketToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, Expressions, MissableExpression } from './Expression';

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
    indexExpressionExpression: MissableExpression;
    closingSquareBracket: MissableToken<ClosingSquareBracketToken>;
}
