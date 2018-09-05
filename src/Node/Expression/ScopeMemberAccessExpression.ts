import { MissingExpressionToken, PeriodToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, Expressions } from './Expression';

export class ScopeMemberAccessExpression extends Expression {
    static CHILD_NAMES: (keyof ScopeMemberAccessExpression)[] = [
        'newlines',
        'scopableExpression',
        'scopeMemberAccessOperator',
        'member',
    ];

    readonly kind = NodeKind.ScopeMemberAccessExpression;

    scopableExpression: Expressions | MissingExpressionToken;
    scopeMemberAccessOperator: PeriodToken;
    member: Expressions | MissingExpressionToken;
}
