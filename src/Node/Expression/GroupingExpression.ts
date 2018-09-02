import { MissingToken } from '../../Token/MissingToken';
import { ClosingParenthesisToken, OpeningParenthesisToken } from '../../Token/Token';
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

    openingParenthesis: OpeningParenthesisToken;
    expression: Expressions | MissingToken;
    closingParenthesis: ClosingParenthesisToken;
}
