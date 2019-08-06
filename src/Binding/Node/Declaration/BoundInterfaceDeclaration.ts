import { InterfaceDeclaration } from '../../../Syntax/Node/Declaration/InterfaceDeclaration';
import { BoundSymbol, BoundSymbolTable } from '../../BoundSymbol';
import { ObjectType } from '../../Type/ObjectType';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';

export class BoundInterfaceDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.InterfaceDeclaration;

    declaration: InterfaceDeclaration = undefined!;

    identifier: BoundSymbol = undefined!;
    type: ObjectType = undefined!;

    baseTypes?: BoundInterfaceDeclaration[] = undefined;

    readonly locals = new BoundSymbolTable();
}
