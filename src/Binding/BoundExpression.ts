import { BoundNode } from './BoundNode';
import { BoundNodeKind } from './BoundNodeKind';
import { Type } from './Type/Type';

export abstract class BoundExpression extends BoundNode {
    constructor(
        kind: BoundNodeKind,
        readonly type: Type,
    ) {
        super(kind);
    }
}
