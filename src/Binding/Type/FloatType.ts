import { Type } from './Type';
import { TypeKind } from './TypeKind';

export class FloatType extends Type {
    static readonly type = new FloatType();

    private constructor() {
        super(TypeKind.Float);
    }

    isConvertibleTo(target: Type): boolean {
        // TODO: Boxing conversion

        switch (target.kind) {
            case TypeKind.Int:
            case TypeKind.Float:
            case TypeKind.String: {
                return true;
            }
        }

        return false;
    }
}
