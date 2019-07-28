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

    constructor(rootType?: ObjectType) {
        super();

        if (rootType) {
            this.rootType = rootType;
        } else {
            this.rootType = this;
            this.instantiatedTypes = [];
        }
    }

    readonly kind = TypeKind.Object;

    readonly rootType: ObjectType;
    typeParameters?: TypeParameterType[] = undefined;
    typeArguments?: Types[] = undefined;
    superType?: ObjectType = undefined;
    implementedTypes?: ObjectType[] = undefined;
    readonly members = new TypeTable();

    readonly instantiatedTypes?: ObjectType[];

    isConvertibleTo(target: Types): boolean {
        if (this === ObjectType.nullType &&
            target.kind === TypeKind.Object
        ) {
            return true;
        }

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

            const args = this.typeArguments || this.typeParameters;
            if (args) {
                str += '<';

                const argNames: Types[] = [];
                for (const arg of args) {
                    argNames.push(arg);
                }
                str += argNames.join(',');

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
