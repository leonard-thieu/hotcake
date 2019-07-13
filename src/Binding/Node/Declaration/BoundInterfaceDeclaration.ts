import { BoundSymbol, BoundSymbolTable } from '../../BoundSymbol';
import { Type } from '../../Type/Type';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundInterfaceMethodDeclaration } from './BoundInterfaceMethodDeclaration';

export class BoundInterfaceDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.InterfaceDeclaration;

    identifier: BoundSymbol = undefined!;
    locals: BoundSymbolTable = undefined!;
    type: Type = undefined!;

    baseTypes?: Type[] = undefined;
    members: BoundInterfaceDeclarationMember[] = undefined!;
}

export type BoundInterfaceDeclarationMember =
    BoundDataDeclaration |
    BoundInterfaceMethodDeclaration
    ;
