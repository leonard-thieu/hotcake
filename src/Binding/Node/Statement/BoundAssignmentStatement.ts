import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpressions } from '../Expression/BoundExpressions';

export class BoundAssignmentStatement extends BoundNode {
    readonly kind = BoundNodeKind.AssignmentStatement;

    leftOperand: BoundExpressions = undefined!;
    rightOperand: BoundExpressions = undefined!;
}
