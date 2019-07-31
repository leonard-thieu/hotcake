import { BoundNode } from './BoundNode';
import { BoundNodeKind } from './BoundNodeKind';
import { BoundModuleDeclaration } from './Declaration/BoundModuleDeclaration';

export class BoundModulePath extends BoundNode {
    readonly kind = BoundNodeKind.ModulePath;

    moduleIdentifier: BoundModuleDeclaration = undefined!;
}
