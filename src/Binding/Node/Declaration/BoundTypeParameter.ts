import { BoundSymbol } from '../../BoundSymbol';
import { TypeParameterType } from '../../Type/TypeParameterType';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';

export class BoundTypeParameter extends BoundNode {
    readonly kind = BoundNodeKind.TypeParameter;

    identifier: BoundSymbol = undefined!;
    type: TypeParameterType = undefined!;
}
