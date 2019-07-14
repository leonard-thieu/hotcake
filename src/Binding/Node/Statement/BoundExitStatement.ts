import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';

export class BoundExitStatement extends BoundNode {
    readonly kind = BoundNodeKind.ExitStatement;
}
