import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpressions } from '../Expression/BoundExpressions';

export class BoundThrowStatement extends BoundNode {
    readonly kind = BoundNodeKind.ThrowStatement;

    expression: BoundExpressions = undefined!;
}
