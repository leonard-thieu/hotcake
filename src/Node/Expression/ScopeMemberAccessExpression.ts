import { IdentifierToken, MissingExpressionToken, PeriodToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, Expressions } from './Expression';

export class ScopeMemberAccessExpression extends Expression {
    static CHILD_NAMES: (keyof ScopeMemberAccessExpression)[] = [
        'newlines',
        'scopableExpression',
        'scopeMemberAccessOperator',
        'identifier',
    ];

    readonly kind = NodeKind.ScopeMemberAccessExpression;

    scopableExpression: Expressions | MissingExpressionToken;
    scopeMemberAccessOperator: PeriodToken;
    identifier: IdentifierToken;
}
