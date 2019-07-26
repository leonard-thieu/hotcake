import { BoundSymbol } from '../BoundSymbol';
import { BoundClassDeclaration } from '../Node/Declaration/BoundClassDeclaration';
import { BoundInterfaceDeclaration } from '../Node/Declaration/BoundInterfaceDeclaration';
import { BoundExternClassDeclaration } from '../Node/Declaration/Extern/BoundExternClassDeclaration';
import { Type } from './Type';
import { TypeKind } from './TypeKind';
import { TypeParameterType } from './TypeParameterType';
import { Types } from './Types';
import { TypeTable } from './TypeTable';

export class ObjectType extends Type {
    static readonly type = new ObjectType();
    static readonly nullType = new ObjectType();

    readonly kind = TypeKind.Object;

    declaration?: ObjectTypeDeclaration = undefined;
    identifier?: BoundSymbol = undefined;
    superType?: ObjectType = undefined;
    typeParameters?: TypeParameterType[] = undefined;
    readonly members = new TypeTable();

    isConvertibleTo(target: Types): boolean {
        if (target === ObjectType.nullType) { return true; }
        if (target === this) { return true; }

        // TODO: Implements `target`

        let ancestorType = this.superType;
        while (ancestorType) {
            if (target === ancestorType) {
                return true;
            }

            ancestorType = ancestorType.superType;
        }

        // TODO: Unboxing conversions

        return false;
    }

    toString(): string {
        if (this === ObjectType.nullType) {
            return 'Null';
        }

        if (this.identifier) {
            let str = this.identifier.name;

            if (this.typeParameters &&
                this.typeParameters.length
            ) {
                str += '<';

                const typeParameterNames: string[] = [];
                for (const typeParameter of this.typeParameters) {
                    typeParameterNames.push(typeParameter.identifier.name);
                }
                str += typeParameterNames.join(',');

                str += '>';
            }

            return str;
        }

        return super.toString();
    }
}

export type ObjectTypeDeclaration =
    | BoundExternClassDeclaration
    | BoundInterfaceDeclaration
    | BoundClassDeclaration
    ;
