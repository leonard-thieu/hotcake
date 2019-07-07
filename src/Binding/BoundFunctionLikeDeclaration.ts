import { BoundExpressionStatement } from './BoundExpressionStatement';
import { BoundNode } from './BoundNode';
import { BoundNodeKind } from './BoundNodeKind';

export class BoundFunctionLikeDeclaration extends BoundNode {
    constructor(readonly statements: BoundExpressionStatement[]) {
        super(BoundNodeKind.FunctionLikeDeclaration);
    }
}
