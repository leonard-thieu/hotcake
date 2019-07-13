import { Type } from '../../Type/Type';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from '../Expression/BoundExpression';
import { BoundStatementsParent } from './BoundStatements';

export class BoundReturnStatement extends BoundNode {
    readonly kind = BoundNodeKind.ReturnStatement;

    parent: BoundStatementsParent = undefined!;
    type: Type = undefined!;

    expression: BoundExpression = undefined!;
}
