import { BoundSymbol, BoundSymbolTable } from '../../BoundSymbol';
import { BoundNode, BoundNodeKind } from '../BoundNodes';

export class BoundDirectory extends BoundNode {
    readonly kind = BoundNodeKind.Directory;

    identifier: BoundSymbol = undefined!;
    fullPath: string = undefined!;

    readonly locals = new BoundSymbolTable();
}
