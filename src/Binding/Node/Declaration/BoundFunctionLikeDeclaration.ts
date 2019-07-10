import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpressionStatement } from '../Statement/BoundExpressionStatement';

export class BoundFunctionLikeDeclaration extends BoundNode {
    constructor(readonly statements: BoundExpressionStatement[]) {
        super(BoundNodeKind.FunctionLikeDeclaration);
    }
}
