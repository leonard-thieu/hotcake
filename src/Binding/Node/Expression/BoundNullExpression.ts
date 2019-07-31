import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundNullExpression extends BoundExpression {
    readonly kind = BoundNodeKind.NullExpression;
}
