import { Type } from './Type';
import { TypeKind } from './TypeKind';
import { Types } from './Types';
import { BoundExternClassDeclaration } from '../Node/Declaration/Extern/BoundExternClassDeclaration';

export class ArrayType extends Type {
    constructor(
        readonly declaration: BoundExternClassDeclaration,
        readonly elementType: Types,
    ) {
        super();
    }

    readonly kind = TypeKind.Array;

    isConvertibleTo(target: Types): boolean {
        if (target.kind === TypeKind.Array) {
            if (target.elementType === this.elementType) { return true; }
            if (target.elementType.kind === TypeKind.Void) { return true; }
        }

        return false;
    }

    toString() {
        let type = this.elementType;
        let i = 1;
        while (type.kind === TypeKind.Array) {
            type = type.elementType;
            i++;
        }

        return type + '[]'.repeat(i);
    }
}
