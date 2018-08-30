import { MissingToken } from '../../Token/MissingToken';
import { Token } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, Expressions } from './Expression';

export class GroupingExpression extends Expression {
    static CHILD_NAMES: (keyof GroupingExpression)[] = [
        'newlines',
        'openingParenthesis',
        'expression',
        'closingParenthesis',
    ];

    readonly kind = NodeKind.GroupingExpression;

    openingParenthesis: Token;
    expression: Expressions | MissingToken;
    closingParenthesis: Token;
}
