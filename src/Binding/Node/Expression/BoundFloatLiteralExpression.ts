import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundFloatLiteralExpression extends BoundExpression {
    readonly kind = BoundNodeKind.FloatLiteralExpression;
}
