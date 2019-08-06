import { BoundSymbol } from '../../BoundSymbol';
import { IntrinsicType } from '../../Type/Types';
import { BoundNode, BoundNodeKind } from '../BoundNodes';

export class BoundIntrinsicTypeDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.IntrinsicType;

    identifier: BoundSymbol = undefined!;
    type: IntrinsicType = undefined!;
}
