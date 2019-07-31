import { Project } from '../../../Project';
import { ModuleDeclaration } from '../../../Syntax/Node/Declaration/ModuleDeclaration';
import { BoundSymbol, BoundSymbolTable } from '../../BoundSymbol';
import { ModuleType } from '../../Type/ModuleType';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundClassDeclaration } from './BoundClassDeclaration';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundDirectory } from './BoundDirectory';
import { BoundExternFunctionGroupDeclaration, BoundFunctionGroupDeclaration } from './BoundFunctionLikeGroupDeclaration';
import { BoundInterfaceDeclaration } from './BoundInterfaceDeclaration';
import { BoundTypeMembers } from './BoundTypeMembers';
import { BoundExternClassDeclaration } from './Extern/BoundExternClassDeclaration';
import { BoundExternDataDeclaration } from './Extern/BoundExternDataDeclaration';

export class BoundModuleDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ModuleDeclaration;

    declaration: ModuleDeclaration = undefined!;

    project: Project = undefined!;
    directory: BoundDirectory = undefined!;

    identifier: BoundSymbol = undefined!;
    locals: BoundSymbolTable = undefined!;
    type: ModuleType = undefined!;

    members: BoundTypeMembers<BoundModuleDeclarationMember> = undefined!;
}

export type BoundModuleDeclarationMember =
    | BoundExternDataDeclaration
    | BoundExternFunctionGroupDeclaration
    | BoundExternClassDeclaration
    | BoundDataDeclaration
    | BoundFunctionGroupDeclaration
    | BoundInterfaceDeclaration
    | BoundClassDeclaration
    ;
