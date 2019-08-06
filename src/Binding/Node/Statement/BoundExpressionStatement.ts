import { BoundNode, BoundNodeKind } from '../BoundNodes';
import { BoundExpressions } from '../Expression/BoundExpressions';

export class BoundExpressionStatement extends BoundNode {
    readonly kind = BoundNodeKind.ExpressionStatement;

    expression: BoundExpressions = undefined!;
}
