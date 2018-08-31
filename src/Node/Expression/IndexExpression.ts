import { MissingToken } from '../../Token/MissingToken';
import { Token } from '../../Token/Token';
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
    openingSquareBracket: Token;

    indexExpressionExpression: Expressions | MissingToken | null = null;

    startExpression: Expressions | MissingToken | null = null;
    sliceOperator: Token | null = null;
    endExpression: Expressions | MissingToken | null = null;

    closingSquareBracket: Token;
}
