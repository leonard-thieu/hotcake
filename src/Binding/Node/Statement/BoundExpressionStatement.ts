import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from '../Expression/BoundExpression';
import { BoundStatementsParent } from './BoundStatements';

export class BoundExpressionStatement extends BoundNode {
    readonly kind = BoundNodeKind.ExpressionStatement;

    parent: BoundStatementsParent = undefined!;

    expression: BoundExpression = undefined!;
}
