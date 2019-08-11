import { BoundModuleDeclaration } from '../Node/Declaration/BoundModuleDeclaration';
import { Type, TypeKind, Types } from './Types';

export class ModuleType extends Type {
    constructor(readonly declaration: BoundModuleDeclaration) {
        super();
    }

    readonly kind = TypeKind.Module;

    isConvertibleTo(_target: Types): boolean {
        throw new Error(`'${this.kind}' types are not convertible.`);
    }
}
