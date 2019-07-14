import { Type } from './Type';
import { TypeKind } from './TypeKind';
import { Types } from './Types';

export class StringType extends Type {
    static readonly type = new StringType();

    private constructor() {
        super();
    }

    readonly kind = TypeKind.String;

    isConvertibleTo(target: Types): boolean {
        // TODO: Boxing conversion

        switch (target.kind) {
            case TypeKind.String: {
                return true;
            }
        }

        return false;
    }
}
