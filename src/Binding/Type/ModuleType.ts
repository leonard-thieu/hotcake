import { BoundModuleDeclaration } from '../Node/Declaration/BoundModuleDeclaration';
import { Type } from './Type';
import { TypeKind, Types } from './Types';

export class ModuleType extends Type {
    constructor(readonly declaration: BoundModuleDeclaration) {
        super();
    }

    readonly kind = TypeKind.Module;

    isConvertibleTo(target: Types): boolean {
        throw new Error('Method not implemented.');
    }
}
