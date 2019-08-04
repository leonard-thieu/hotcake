import { InterfaceDeclaration } from '../../../Syntax/Node/Declaration/InterfaceDeclaration';
import { BoundSymbol, BoundSymbolTable } from '../../BoundSymbol';
import { ObjectType } from '../../Type/ObjectType';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundInterfaceMethodGroupDeclaration } from './BoundFunctionLikeGroupDeclaration';
import { BoundTypeMembers } from './BoundTypeMembers';

export class BoundInterfaceDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.InterfaceDeclaration;

    declaration: InterfaceDeclaration = undefined!;

    identifier: BoundSymbol = undefined!;
    readonly locals = new BoundSymbolTable();
    type: ObjectType = undefined!;

    baseTypes?: BoundInterfaceDeclaration[] = undefined;
    readonly members = new BoundTypeMembers<BoundInterfaceDeclarationMember>();
}

export type BoundInterfaceDeclarationMember =
    | BoundDataDeclaration
    | BoundInterfaceMethodGroupDeclaration
    ;
