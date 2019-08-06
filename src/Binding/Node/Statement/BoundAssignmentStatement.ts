import { AssignmentOperatorToken } from '../../../Syntax/Node/Statement/AssignmentStatement';
import { BoundNode, BoundNodeKind } from '../BoundNodes';
import { BoundExpressions } from '../Expression/BoundExpressions';

export class BoundAssignmentStatement extends BoundNode {
    readonly kind = BoundNodeKind.AssignmentStatement;

    leftOperand: BoundExpressions = undefined!;
    operator: AssignmentOperatorToken['kind'] = undefined!;
    rightOperand: BoundExpressions = undefined!;
}
