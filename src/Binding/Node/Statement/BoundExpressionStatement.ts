import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpressions } from '../Expression/BoundExpressions';

export class BoundExpressionStatement extends BoundNode {
    readonly kind = BoundNodeKind.ExpressionStatement;

    expression: BoundExpressions = undefined!;
}
