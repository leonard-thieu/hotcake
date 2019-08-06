import { Project } from '../../../Project';
import { ModuleDeclaration } from '../../../Syntax/Node/Declaration/ModuleDeclaration';
import { BoundSymbol, BoundSymbolTable } from '../../BoundSymbol';
import { ModuleType } from '../../Type/ModuleType';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundDirectory } from './BoundDirectory';

export class BoundModuleDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ModuleDeclaration;

    declaration: ModuleDeclaration = undefined!;

    project: Project = undefined!;
    directory: BoundDirectory = undefined!;

    identifier: BoundSymbol = undefined!;
    readonly importedModules = new Set<BoundModuleDeclaration>();
    type: ModuleType = undefined!;

    readonly locals = new BoundSymbolTable();
}
