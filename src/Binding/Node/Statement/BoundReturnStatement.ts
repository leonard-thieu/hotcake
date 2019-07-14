import { Types } from '../../Type/Types';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from '../Expression/BoundExpression';

export class BoundReturnStatement extends BoundNode {
    readonly kind = BoundNodeKind.ReturnStatement;

    type: Types = undefined!;

    expression: BoundExpression = undefined!;
}
