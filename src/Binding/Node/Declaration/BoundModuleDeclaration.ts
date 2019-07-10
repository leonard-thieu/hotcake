import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundFunctionLikeDeclaration } from './BoundFunctionLikeDeclaration';

export class BoundModuleDeclaration extends BoundNode {
    constructor(readonly members: BoundFunctionLikeDeclaration[]) {
        super(BoundNodeKind.ModuleDeclaration);
    }
}
