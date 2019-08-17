import { Project } from '../../../Project';
import { ModuleDeclaration } from '../../../Syntax/Node/Declaration/ModuleDeclaration';
import { BoundSymbol, BoundSymbolTable } from '../../BoundSymbol';
import { ModuleType } from '../../Type/ModuleType';
import { BoundNode, BoundNodeKind } from '../BoundNodes';
import { BoundDirectory } from './BoundDirectory';

export class BoundModuleDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ModuleDeclaration;

    declaration: ModuleDeclaration = undefined!;

    project: Project = undefined!;
    directory: BoundDirectory = undefined!;

    identifier: BoundSymbol = undefined!;
    type: ModuleType = undefined!;

    frameworkModule: BoundModuleDeclaration = undefined!;
    readonly importedModules = new Set<BoundModuleDeclaration>();
    readonly locals = new BoundSymbolTable();
}
