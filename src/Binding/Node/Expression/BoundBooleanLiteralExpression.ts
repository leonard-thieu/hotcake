import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundBooleanLiteralExpression extends BoundExpression {
    readonly kind = BoundNodeKind.BooleanLiteralExpression;
}
