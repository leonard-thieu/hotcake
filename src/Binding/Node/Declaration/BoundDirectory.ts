import { BoundSymbol, BoundSymbolTable } from '../../BoundSymbol';
import { VoidType } from '../../Type/VoidType';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';

export class BoundDirectory extends BoundNode {
    readonly kind = BoundNodeKind.Directory;

    locals: BoundSymbolTable = undefined!;
    readonly type = VoidType.type;

    identifier: BoundSymbol = undefined!;
    fullPath: string = undefined!;
}
