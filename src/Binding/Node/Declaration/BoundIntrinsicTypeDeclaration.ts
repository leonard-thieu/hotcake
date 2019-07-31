import { IntrinsicType } from '../../Type/Types';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';

export class BoundIntrinsicTypeDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.IntrinsicType;

    type: IntrinsicType = undefined!;
}
