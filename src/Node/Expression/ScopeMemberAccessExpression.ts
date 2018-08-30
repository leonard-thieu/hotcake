import { MissingToken } from '../../Token/MissingToken';
import { Token } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, Expressions } from './Expression';

export class ScopeMemberAccessExpression extends Expression {
    static CHILD_NAMES: (keyof ScopeMemberAccessExpression)[] = [
        'scopableExpression',
        'scopeMemberAccessOperator',
        'identifier',
    ];

    readonly kind = NodeKind.ScopeMemberAccessExpression;

    scopableExpression: Expressions | MissingToken;
    scopeMemberAccessOperator: Token;
    identifier: Token;
}
