import { BoundNodeKind } from '../BoundNodes';
import { BoundExpression } from './BoundExpressions';

export class BoundPlaceholderExpression extends BoundExpression {
    readonly kind = BoundNodeKind.PlaceholderExpression;
}
