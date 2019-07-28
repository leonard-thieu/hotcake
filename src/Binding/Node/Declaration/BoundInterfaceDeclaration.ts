import { InterfaceDeclaration } from '../../../Syntax/Node/Declaration/InterfaceDeclaration';
import { BoundSymbol, BoundSymbolTable } from '../../BoundSymbol';
import { ObjectType } from '../../Type/ObjectType';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundInterfaceMethodDeclaration } from './BoundInterfaceMethodDeclaration';

export class BoundInterfaceDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.InterfaceDeclaration;

    declaration: InterfaceDeclaration = undefined!;

    identifier: BoundSymbol = undefined!;
    locals: BoundSymbolTable = undefined!;
    type: ObjectType = undefined!;

    baseTypes?: ObjectType[] = undefined;
    members: BoundInterfaceDeclarationMember[] = undefined!;
}

export type BoundInterfaceDeclarationMember =
    | BoundDataDeclaration
    | BoundInterfaceMethodDeclaration
    ;
