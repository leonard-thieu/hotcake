import { Types } from '../../Type/Types';
import { BoundNode, BoundNodeKind } from '../BoundNodes';
import { BoundExpressions } from '../Expression/BoundExpressions';

export class BoundReturnStatement extends BoundNode {
    readonly kind = BoundNodeKind.ReturnStatement;

    type: Types = undefined!;
    expression?: BoundExpressions = undefined!;
}
