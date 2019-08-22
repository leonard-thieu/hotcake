import { BoundNodeKind } from '../BoundNodes';
import { BoundExpression, BoundExpressions } from './BoundExpressions';

export class BoundCastExpression extends BoundExpression {
    readonly kind = BoundNodeKind.CastExpression;

    invocableExpression: BoundExpressions = undefined!;
    argument: BoundExpressions = undefined!;
}
