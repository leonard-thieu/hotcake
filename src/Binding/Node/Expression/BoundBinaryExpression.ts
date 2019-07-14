import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';
import { BoundExpressions } from './BoundExpressions';

export class BoundBinaryExpression extends BoundExpression {
    readonly kind = BoundNodeKind.BinaryExpression;

    leftOperand: BoundExpressions = undefined!;
    rightOperand: BoundExpressions = undefined!;
}
