import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';
import { BoundExpressions } from './BoundExpressions';

export class BoundUnaryExpression extends BoundExpression {
    readonly kind = BoundNodeKind.UnaryExpression;

    operand: BoundExpressions = undefined!;
}
