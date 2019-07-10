import { ErrorableToken, PeriodToken } from '../../Token/Token';
import { isNode } from '../Node';
import { NodeKind } from '../NodeKind';
import { Expression, Expressions, MissableExpression } from './Expression';

export class ScopeMemberAccessExpression extends Expression {
    static CHILD_NAMES: (keyof ScopeMemberAccessExpression)[] = [
        'newlines',
        'scopableExpression',
        'scopeMemberAccessOperator',
        'member',
    ];

    readonly kind = NodeKind.ScopeMemberAccessExpression;

    scopableExpression: Expressions = undefined!;
    scopeMemberAccessOperator: PeriodToken = undefined!;
    member: MissableExpression = undefined!;

    get firstToken(): ErrorableToken {
        if (this.newlines && this.newlines.length !== 0) {
            return this.newlines[0];
        }

        return this.scopableExpression.firstToken;
    }

    get lastToken(): ErrorableToken {
        if (isNode(this.member)) {
            return this.member.lastToken;
        }

        return this.member;
    }
}
