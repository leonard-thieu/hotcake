import { BoundSymbol } from '../BoundSymbol';
import { BoundClassDeclaration } from '../Node/Declaration/BoundClassDeclaration';
import { BoundTypeParameter } from '../Node/Declaration/BoundTypeParameter';
import { Type } from './Type';
import { TypeKind } from './TypeKind';
import { Types } from './Types';

export class TypeParameterType extends Type {
    readonly kind = TypeKind.TypeParameter;

    declaration: BoundTypeParameter = undefined!;
    identifier: BoundSymbol = undefined!;

    isConvertibleTo(target: Types): boolean {
        return target === this;
    }

    toString(): string {
        const parent = this.declaration.parent! as BoundClassDeclaration;
        const className = parent.identifier.name;

        const parameterName = this.identifier.name;

        return `${className}:${parameterName}`;
    }
}
