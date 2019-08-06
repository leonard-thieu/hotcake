import { TypeKind, Types } from './Types';

export abstract class Type {
    abstract readonly kind: TypeKind;

    abstract isConvertibleTo(target: Types): boolean;

    toString(): string {
        return this.kind.toString();
    }
}
