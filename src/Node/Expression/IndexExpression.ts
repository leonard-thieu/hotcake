import { MissingToken } from '../../Token/MissingToken';
import { Token } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, Expressions } from './Expression';

export class IndexExpression extends Expression {
    static CHILD_NAMES: (keyof IndexExpression)[] = [
        'indexableExpression',
        'openingSquareBracket',
        'indexExpressionExpression',
        'closingSquareBracket',
    ];

    readonly kind = NodeKind.IndexExpression;
    
    indexableExpression: Expressions;
    openingSquareBracket: Token;
    indexExpressionExpression: Expressions | MissingToken;
    closingSquareBracket: Token;
}
