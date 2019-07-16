import { IdentifierToken } from '../../Syntax/Token/Token';
import { BoundNode } from './BoundNode';
import { BoundNodeKind } from './BoundNodeKind';

export class BoundModulePath extends BoundNode {
    readonly kind = BoundNodeKind.ModulePath;

    children: IdentifierToken[] = undefined!;
}
