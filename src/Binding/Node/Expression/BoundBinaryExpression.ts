import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundBinaryExpression extends BoundExpression {
    readonly kind = BoundNodeKind.BinaryExpression;

    leftOperand: BoundExpression = undefined!;
    rightOperand: BoundExpression = undefined!;
}
