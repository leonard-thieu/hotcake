import { Type } from './Type';
import { TypeKind } from './TypeKind';
import { Types } from './Types';

export class FloatType extends Type {
    static readonly type = new FloatType();

    private constructor() {
        super();
    }

    readonly kind = TypeKind.Float;

    isConvertibleTo(target: Types): boolean {
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
