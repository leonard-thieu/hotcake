import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';
import { BoundExpressions } from './BoundExpressions';

export class BoundAssignmentExpression extends BoundExpression {
    readonly kind = BoundNodeKind.AssignmentExpression;

    leftOperand: BoundExpressions = undefined!;
    rightOperand: BoundExpressions = undefined!;
}
