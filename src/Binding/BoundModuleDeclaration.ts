import { BoundFunctionLikeDeclaration } from './BoundFunctionLikeDeclaration';
import { BoundNode } from './BoundNode';
import { BoundNodeKind } from './BoundNodeKind';

export class BoundModuleDeclaration extends BoundNode {
    constructor(readonly members: BoundFunctionLikeDeclaration[]) {
        super(BoundNodeKind.ModuleDeclaration);
    }
}
