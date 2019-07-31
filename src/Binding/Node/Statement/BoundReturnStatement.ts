import { Types } from '../../Type/Types';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpressions } from '../Expression/BoundExpressions';

export class BoundReturnStatement extends BoundNode {
    readonly kind = BoundNodeKind.ReturnStatement;

    type: Types = undefined!;
    expression: BoundExpressions = undefined!;
}
