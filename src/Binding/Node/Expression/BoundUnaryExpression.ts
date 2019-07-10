import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundUnaryExpression extends BoundExpression {
    readonly kind = BoundNodeKind.UnaryExpression;

    operand: BoundExpression = undefined!;
}
