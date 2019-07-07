import { BoundNode } from './BoundNode';
import { BoundNodeKind } from './BoundNodeKind';

export abstract class BoundExpression extends BoundNode {
    constructor(
        kind: BoundNodeKind,
        readonly type: string
    ) {
        super(kind);
    }
}
