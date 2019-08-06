import { BoundNode, BoundNodeKind } from '../BoundNodes';

export class BoundContinueStatement extends BoundNode {
    readonly kind = BoundNodeKind.ContinueStatement;
}
