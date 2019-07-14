import { TypeKind } from './TypeKind';
import { Types } from './Types';

export abstract class Type {
    abstract readonly kind: TypeKind;

    abstract isConvertibleTo(target: Types): boolean;

    toString() {
        return this.kind.toString();
    }
}
