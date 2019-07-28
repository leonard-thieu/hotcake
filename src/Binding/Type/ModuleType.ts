import { Type } from './Type';
import { TypeKind } from './TypeKind';
import { Types } from './Types';
import { TypeTable } from './TypeTable';

export class ModuleType extends Type {
    readonly kind = TypeKind.Module;

    readonly members = new TypeTable();

    isConvertibleTo(target: Types): boolean {
        throw new Error('Method not implemented.');
    }
}
