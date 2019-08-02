import { BoundSymbol } from '../../BoundSymbol';
import { IntrinsicType } from '../../Type/Types';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';

export class BoundIntrinsicTypeDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.IntrinsicType;

    identifier: BoundSymbol = undefined!;
    type: IntrinsicType = undefined!;
}
