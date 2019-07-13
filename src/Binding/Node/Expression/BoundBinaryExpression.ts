import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundBinaryExpression extends BoundExpression {
    readonly kind = BoundNodeKind.BinaryExpression;

    parent: BoundNode = undefined!;

    leftOperand: BoundExpression = undefined!;
    rightOperand: BoundExpression = undefined!;
}
