import { ObjectType } from './ObjectType';
import { Type } from './Type';
import { TypeKind } from './TypeKind';
import { Types } from './Types';

export class TypeParameterType extends Type {
    readonly kind = TypeKind.TypeParameter;

    parent: ObjectType = undefined!;

    isConvertibleTo(target: Types): boolean {
        return target === this;
    }

    toString(): string {
        const className = this.parent.identifier!.name;
        const parameterName = this.identifier.name;

        return `${className}:${parameterName}`;
    }
}
