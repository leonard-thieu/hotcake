import { BoundNode, BoundNodeKind } from '../BoundNodes';
import { BoundExpressions } from '../Expression/BoundExpressions';

export class BoundThrowStatement extends BoundNode {
    readonly kind = BoundNodeKind.ThrowStatement;

    expression: BoundExpressions = undefined!;
}
