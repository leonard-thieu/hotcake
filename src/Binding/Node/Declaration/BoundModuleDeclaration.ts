import { BoundSymbol, BoundSymbolTable } from '../../BoundSymbol';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundClassDeclaration } from './BoundClassDeclaration';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundFunctionDeclaration } from './BoundFunctionDeclaration';
import { BoundInterfaceDeclaration } from './BoundInterfaceDeclaration';
import { BoundExternDataDeclaration } from './Extern/BoundExternDataDeclaration';

export class BoundModuleDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ModuleDeclaration;

    identifier: BoundSymbol = undefined!;
    locals: BoundSymbolTable = undefined!;

    members: BoundModuleDeclarationMember[] = undefined!;
}

export type BoundModuleDeclarationMember =
    BoundExternDataDeclaration |
    BoundDataDeclaration |
    BoundFunctionDeclaration |
    BoundInterfaceDeclaration |
    BoundClassDeclaration
    ;
