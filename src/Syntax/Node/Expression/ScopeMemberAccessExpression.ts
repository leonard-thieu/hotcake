import { MissingToken } from '../../Token/MissingToken';
import { PeriodToken } from '../../Token/Tokens';
import { NodeKind } from '../Nodes';
import { Expression, Expressions, PrimaryExpression } from './Expressions';

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
    member: PrimaryExpression | MissingToken = undefined!;
}
