import { BoundClassDeclaration } from '../Node/Declaration/BoundClassDeclaration';
import { BoundInterfaceDeclaration } from '../Node/Declaration/BoundInterfaceDeclaration';
import { Type } from './Type';
import { TypeKind } from './TypeKind';
import { Types } from './Types';

export class ObjectType extends Type {
    static readonly type = new ObjectType();
    static readonly nullType = new ObjectType();

    constructor(readonly declaration?: BoundInterfaceDeclaration | BoundClassDeclaration) {
        super();
    }

    readonly kind = TypeKind.Object;

    isConvertibleTo(target: Types): boolean {
        if (target === ObjectType.nullType) { return true; }
        if (target === this) { return true; }

        // TODO: Implements `target`
        // TODO: `target` is super type
        // TODO: Unboxing conversions

        return false;
    }

    toString() {
        if (this === ObjectType.nullType) {
            return 'Null';
        }

        if (this.declaration) {
            return this.declaration.identifier.name;
        }

        return super.toString();
    }
}
