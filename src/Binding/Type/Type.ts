import { TypeKind } from './TypeKind';

export abstract class Type {
    constructor(readonly kind: TypeKind) { }

    abstract isConvertibleTo(target: Type): boolean;

    toString() {
        return this.kind.toString();
    }
}
