import { PeriodToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, MissableExpression } from './Expression';

export class ScopeMemberAccessExpression extends Expression {
    static CHILD_NAMES: (keyof ScopeMemberAccessExpression)[] = [
        'newlines',
        'scopableExpression',
        'scopeMemberAccessOperator',
        'member',
    ];

    readonly kind = NodeKind.ScopeMemberAccessExpression;

    scopableExpression: MissableExpression = undefined!;
    scopeMemberAccessOperator: PeriodToken = undefined!;
    member: MissableExpression = undefined!;
}
