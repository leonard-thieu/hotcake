import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';
import { BoundExpressions } from './BoundExpressions';

export class BoundScopeMemberAccessExpression extends BoundExpression {
    readonly kind = BoundNodeKind.ScopeMemberAccessExpression;

    scopableExpression: BoundExpressions = undefined!;
    member: BoundExpressions = undefined!;
}
