import { BoundSymbol } from '../BoundSymbol';
import { Type } from './Type';
import { TypeKind } from './TypeKind';
import { Types } from './Types';
import { VoidType } from './VoidType';

export class ArrayType extends Type {
    static readonly type = new ArrayType(VoidType.type);

    constructor(readonly elementType: Types) {
        super();

        this.identifier = new BoundSymbol('Array', this);
    }

    readonly kind = TypeKind.Array;

    readonly instantiatedTypes: ArrayType[] = [];

    isConvertibleTo(target: Types): boolean {
        if (target.kind === TypeKind.Array) {
            if (target.elementType === this.elementType) { return true; }
            if (target.elementType === VoidType.type) { return true; }
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
