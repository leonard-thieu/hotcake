import { Project } from '../../../Project';
import { ModuleDeclaration } from '../../../Syntax/Node/Declaration/ModuleDeclaration';
import { BoundSymbol, BoundSymbolTable } from '../../BoundSymbol';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundAliasDirective } from './BoundAliasDirective';
import { BoundClassDeclaration } from './BoundClassDeclaration';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundDirectory } from './BoundDirectory';
import { BoundFunctionDeclaration } from './BoundFunctionDeclaration';
import { BoundImportStatement } from './BoundImportStatement';
import { BoundInterfaceDeclaration } from './BoundInterfaceDeclaration';
import { BoundExternClassDeclaration } from './Extern/BoundExternClassDeclaration';
import { BoundExternDataDeclaration } from './Extern/BoundExternDataDeclaration';
import { BoundExternFunctionDeclaration } from './Extern/BoundExternFunctionDeclaration';

export class BoundModuleDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ModuleDeclaration;

    declaration: ModuleDeclaration = undefined!;

    project: Project = undefined!;
    directory: BoundDirectory = undefined!;

    identifier: BoundSymbol = undefined!;
    locals: BoundSymbolTable = undefined!;

    members: BoundModuleDeclarationMember[] = undefined!;
}

export type BoundModuleDeclarationMember =
    | BoundImportStatement
    | BoundAliasDirective
    | BoundExternDataDeclaration
    | BoundExternFunctionDeclaration
    | BoundExternClassDeclaration
    | BoundDataDeclaration
    | BoundFunctionDeclaration
    | BoundInterfaceDeclaration
    | BoundClassDeclaration
    ;
