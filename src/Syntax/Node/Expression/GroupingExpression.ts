import { MissableToken } from '../../Token/MissingToken';
import { ClosingParenthesisToken, OpeningParenthesisToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, MissableExpression } from './Expression';

export const GroupingExpressionChildNames: ReadonlyArray<keyof GroupingExpression> = [
    'newlines',
    'openingParenthesis',
    'expression',
    'closingParenthesis',
];

export class GroupingExpression extends Expression {
    readonly kind = NodeKind.GroupingExpression;

    openingParenthesis: OpeningParenthesisToken = undefined!;
    expression: MissableExpression = undefined!;
    closingParenthesis: MissableToken<ClosingParenthesisToken> = undefined!;
}
