import { ModuleReference } from '../ModuleReference';
import { BoundNode } from './BoundNode';
import { BoundNodeKind } from './BoundNodeKind';

export class BoundModulePath extends BoundNode {
    readonly kind = BoundNodeKind.ModulePath;

    moduleIdentifier: ModuleReference = undefined!;
}
