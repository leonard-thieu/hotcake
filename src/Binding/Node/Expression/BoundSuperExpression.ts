import { BoundNodeKind } from '../BoundNodes';
import { BoundExpression } from './BoundExpressions';

export class BoundSuperExpression extends BoundExpression {
    readonly kind = BoundNodeKind.SuperExpression;
}
