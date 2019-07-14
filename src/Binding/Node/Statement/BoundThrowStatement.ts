import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from '../Expression/BoundExpression';

export class BoundThrowStatement extends BoundNode {
    readonly kind = BoundNodeKind.ThrowStatement;

    expression: BoundExpression = undefined!;
}
