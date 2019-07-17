import { BoundModuleDeclaration } from './Node/Declaration/BoundModuleDeclaration';

export class ModuleReference {
    constructor(readonly declaration: BoundModuleDeclaration) { }
}
