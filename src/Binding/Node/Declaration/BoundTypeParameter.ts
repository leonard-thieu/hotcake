import { BoundSymbol } from '../../BoundSymbol';
import { TypeParameterType } from '../../Type/TypeParameterType';
import { BoundNode, BoundNodeKind } from '../BoundNodes';

export class BoundTypeParameter extends BoundNode {
    readonly kind = BoundNodeKind.TypeParameter;

    identifier: BoundSymbol = undefined!;
    type: TypeParameterType = undefined!;
}
