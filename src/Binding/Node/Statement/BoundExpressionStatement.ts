import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from '../Expression/BoundExpression';

export class BoundExpressionStatement extends BoundNode {
    readonly kind = BoundNodeKind.ExpressionStatement;

    expression: BoundExpression = undefined!;
}
