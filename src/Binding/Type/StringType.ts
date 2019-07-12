import { Type } from './Type';
import { TypeKind } from './TypeKind';

export class StringType extends Type {
    static readonly type = new StringType();

    private constructor() {
        super(TypeKind.String);
    }

    isConvertibleTo(target: Type): boolean {
        // TODO: Boxing conversion

        switch (target.kind) {
            case TypeKind.String: {
                return true;
            }
        }

        return false;
    }
}
