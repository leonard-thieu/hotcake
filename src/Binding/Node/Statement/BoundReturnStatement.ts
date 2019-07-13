import { Type } from '../../Type/Type';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from '../Expression/BoundExpression';

export class BoundReturnStatement extends BoundNode {
    readonly kind = BoundNodeKind.ReturnStatement;

    type: Type = undefined!;

    expression: BoundExpression = undefined!;
}
