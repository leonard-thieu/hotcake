import { BoundSymbol, BoundSymbolTable } from '../../BoundSymbol';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';

export class BoundDirectory extends BoundNode {
    readonly kind = BoundNodeKind.Directory;

    readonly locals = new BoundSymbolTable();

    identifier: BoundSymbol = undefined!;
    fullPath: string = undefined!;
}
