import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundFunctionLikeDeclaration } from './BoundFunctionLikeDeclaration';

export class BoundModuleDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ModuleDeclaration;

    members: BoundFunctionLikeDeclaration[] = undefined!;
}
