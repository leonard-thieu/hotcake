import { PeriodToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, Expressions, MissableExpression } from './Expression';

export const ScopeMemberAccessExpressionChildNames: ReadonlyArray<keyof ScopeMemberAccessExpression> = [
    'newlines',
    'scopableExpression',
    'scopeMemberAccessOperator',
    'member',
];

export class ScopeMemberAccessExpression extends Expression {
    readonly kind = NodeKind.ScopeMemberAccessExpression;

    scopableExpression: Expressions = undefined!;
    scopeMemberAccessOperator: PeriodToken = undefined!;
    member: MissableExpression = undefined!;
}
