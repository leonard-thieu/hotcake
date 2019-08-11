import { BoundClassDeclaration } from '../Node/Declaration/BoundClassDeclaration';
import { BoundTypeParameter } from '../Node/Declaration/BoundTypeParameter';
import { Type, TypeKind, Types } from './Types';

export class TypeParameterType extends Type {
    constructor(readonly declaration: BoundTypeParameter) {
        super();
    }

    readonly kind = TypeKind.TypeParameter;

    isConvertibleTo(target: Types): boolean {
        return target === this;
    }

    toString(): string {
        const parent = this.declaration.parent as BoundClassDeclaration;
        const className = parent.identifier!.name;
        const parameterName = this.declaration.identifier.name;

        return `${className}:${parameterName}`;
    }
}
