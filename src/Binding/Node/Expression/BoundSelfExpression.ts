import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundSelfExpression extends BoundExpression {
    readonly kind = BoundNodeKind.SelfExpression;
}
