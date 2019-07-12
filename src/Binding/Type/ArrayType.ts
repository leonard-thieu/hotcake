import { Type } from './Type';
import { TypeKind } from './TypeKind';
import { VoidType } from './VoidType';

export class ArrayType extends Type {
    constructor(readonly elementType: Type) {
        super(TypeKind.Array);
    }

    isConvertibleTo(target: Type): boolean {
        if (target.kind === TypeKind.Array) {
            const t = target as ArrayType;
            if (t.elementType === this.elementType) { return true; }
            if (t.elementType === VoidType.type) { return true; }
        }

        return false;
    }
}
