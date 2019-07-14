import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundNewExpression extends BoundExpression {
    readonly kind = BoundNodeKind.NewExpression;
}