import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';

export class BoundContinueStatement extends BoundNode {
    readonly kind = BoundNodeKind.ContinueStatement;
}
