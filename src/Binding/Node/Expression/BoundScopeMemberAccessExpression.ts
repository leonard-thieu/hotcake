import { BoundNodeKind } from '../BoundNodes';
import { BoundExpression, BoundExpressions } from './BoundExpressions';

export class BoundScopeMemberAccessExpression extends BoundExpression {
    readonly kind = BoundNodeKind.ScopeMemberAccessExpression;

    scopableExpression: BoundExpressions = undefined!;
    member: BoundExpressions = undefined!;
}
