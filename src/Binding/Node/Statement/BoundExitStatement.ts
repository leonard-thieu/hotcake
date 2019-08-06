import { BoundNode, BoundNodeKind } from '../BoundNodes';

export class BoundExitStatement extends BoundNode {
    readonly kind = BoundNodeKind.ExitStatement;
}
