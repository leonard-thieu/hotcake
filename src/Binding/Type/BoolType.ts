import { Type } from './Type';
import { TypeKind } from './TypeKind';

export class BoolType extends Type {
    static readonly type = new BoolType();

    private constructor() {
        super(TypeKind.Bool);
    }

    isConvertibleTo(target: Type): boolean {
        // TODO: Boxing conversion

        switch (target.kind) {
            case TypeKind.Bool:
            case TypeKind.Int: {
                return true;
            }
        }

        return false;
    }
}
