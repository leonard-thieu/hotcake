import { Type } from './Type';
import { TypeKind } from './TypeKind';

export class VoidType extends Type {
    static readonly type = new VoidType();

    private constructor() {
        super(TypeKind.Void);
    }

    isConvertibleTo(target: Type): boolean {
        switch (target.kind) {
            case TypeKind.Void: {
                return true;
            }
        }

        return false;
    }
}
