import { BoundNodeKind } from '../BoundNodes';
import { BoundExpression } from './BoundExpressions';

export class BoundNullExpression extends BoundExpression {
    readonly kind = BoundNodeKind.NullExpression;
}
