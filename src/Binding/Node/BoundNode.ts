import { BoundNodeKind } from './BoundNodeKind';

export abstract class BoundNode {
    abstract readonly kind: BoundNodeKind = undefined!;
}
