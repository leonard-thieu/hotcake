import { BoundSymbol, BoundSymbolTable } from '../../Binder';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundClassDeclaration } from './BoundClassDeclaration';
import { BoundFunctionDeclaration } from './BoundFunctionDeclaration';
import { BoundInterfaceDeclaration } from './BoundInterfaceDeclaration';

export class BoundModuleDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ModuleDeclaration;

    identifier: BoundSymbol = undefined!;
    locals: BoundSymbolTable = undefined!;

    members: BoundModuleDeclarationMember[] = undefined!;
}

export type BoundModuleDeclarationMember =
    BoundInterfaceDeclaration |
    BoundClassDeclaration |
    BoundFunctionDeclaration
    ;
