import { Type } from '../../Type/Type';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';

export abstract class BoundExpression extends BoundNode {
    constructor(
        kind: BoundNodeKind,
        readonly type: Type,
    ) {
        super(kind);
    }
}
