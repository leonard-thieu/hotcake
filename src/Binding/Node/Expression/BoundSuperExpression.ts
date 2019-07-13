import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundSuperExpression extends BoundExpression {
    readonly kind = BoundNodeKind.SuperExpression;
}
