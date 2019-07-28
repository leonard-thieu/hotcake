import { Type } from './Type';
import { TypeKind } from './TypeKind';
import { Types } from './Types';
import { TypeTable } from './TypeTable';

export class StringType extends Type {
    readonly kind = TypeKind.String;

    superType: undefined = undefined;
    readonly members = new TypeTable();

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
