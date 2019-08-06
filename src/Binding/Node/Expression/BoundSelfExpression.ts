import { BoundNodeKind } from '../BoundNodes';
import { BoundExpression } from './BoundExpressions';

export class BoundSelfExpression extends BoundExpression {
    readonly kind = BoundNodeKind.SelfExpression;
}
