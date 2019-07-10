import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpressionStatement } from '../Statement/BoundExpressionStatement';

export class BoundFunctionLikeDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.FunctionLikeDeclaration;

    statements?: BoundExpressionStatement[] = undefined;
}
