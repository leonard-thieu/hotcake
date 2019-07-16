import { BoundSymbol, BoundSymbolTable } from '../../BoundSymbol';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundClassDeclaration } from './BoundClassDeclaration';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundFunctionDeclaration } from './BoundFunctionDeclaration';
import { BoundInterfaceDeclaration } from './BoundInterfaceDeclaration';
import { BoundExternClassDeclaration } from './Extern/BoundExternClassDeclaration';
import { BoundExternDataDeclaration } from './Extern/BoundExternDataDeclaration';
import { BoundExternFunctionDeclaration } from './Extern/BoundExternFunctionDeclaration';

export class BoundModuleDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ModuleDeclaration;

    identifier: BoundSymbol = undefined!;
    locals: BoundSymbolTable = undefined!;

    members: BoundModuleDeclarationMember[] = undefined!;
}

export type BoundModuleDeclarationMember =
    BoundExternDataDeclaration |
    BoundExternFunctionDeclaration |
    BoundExternClassDeclaration |
    BoundDataDeclaration |
    BoundFunctionDeclaration |
    BoundInterfaceDeclaration |
    BoundClassDeclaration
    ;
