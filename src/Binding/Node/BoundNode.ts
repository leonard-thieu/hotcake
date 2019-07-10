import { BoundNodeKind } from './BoundNodeKind';

export abstract class BoundNode {
    constructor(readonly kind: BoundNodeKind) { }
}
