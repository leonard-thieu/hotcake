import { Type } from './Type';
import { TypeKind } from './TypeKind';

export class IntType extends Type {
    static readonly type = new IntType();

    private constructor() {
        super(TypeKind.Int);
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
