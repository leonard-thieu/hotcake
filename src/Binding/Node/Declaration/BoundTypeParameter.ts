import { BoundSymbol } from '../../BoundSymbol';
import { Types } from '../../Type/Types';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';

export class BoundTypeParameter extends BoundNode {
    readonly kind = BoundNodeKind.TypeParameter;

    identifier: BoundSymbol = undefined!;
    type: Types = undefined!;
}
