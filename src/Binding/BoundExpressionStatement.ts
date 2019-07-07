import { BoundExpression } from './BoundExpression';
import { BoundNode } from './BoundNode';
import { BoundNodeKind } from './BoundNodeKind';

export class BoundExpressionStatement extends BoundNode {
    constructor(readonly expression: BoundExpression) {
        super(BoundNodeKind.ExpressionStatement);
    }
}
