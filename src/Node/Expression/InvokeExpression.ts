import { ParseContextElementArray, ParseContextKind } from '../../Parser';
import { Token } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, Expressions } from './Expression';

export class InvokeExpression extends Expression {
    static CHILD_NAMES: (keyof InvokeExpression)[] = [
        'newlines',
        'invokableExpression',
        'openingParenthesis',
        'arguments',
        'closingParenthesis',
    ];

    readonly kind = NodeKind.InvokeExpression;

    invokableExpression: Expressions;
    openingParenthesis: Token | null = null;
    arguments: ParseContextElementArray<ParseContextKind.ExpressionSequence>;
    closingParenthesis: Token | null = null;
}
