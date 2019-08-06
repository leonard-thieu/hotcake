import { BoundNodeKind } from '../Node/BoundNodeKind';
import { BoundClassDeclaration } from '../Node/Declaration/BoundClassDeclaration';
import { BoundInterfaceDeclaration } from '../Node/Declaration/BoundInterfaceDeclaration';
import { BoundExternClassDeclaration } from '../Node/Declaration/Extern/BoundExternClassDeclaration';
import { Type } from './Type';
import { TypeKind } from './TypeKind';
import { Types } from './Types';

export class ObjectType extends Type {
    constructor(readonly declaration: ObjectTypeDeclaration) {
        super();
    }

    readonly kind = TypeKind.Object;

    isConvertibleTo(target: Types): boolean {
        if (target.kind === TypeKind.Null) { return true; }
        if (target === this) { return true; }

        if (this.declaration.kind === BoundNodeKind.ClassDeclaration &&
            target.declaration.kind === BoundNodeKind.ClassDeclaration &&
            this.declaration.rootType &&
            this.declaration.rootType === target.declaration.rootType
        ) {
            const typeArgs1 = this.declaration.typeParameters || this.declaration.typeArguments!;
            const typeArgs2 = target.declaration.typeParameters || target.declaration.typeArguments!;

            let match = true;

            for (let i = 0; i < typeArgs1.length; i++) {
                const typeParameter = typeArgs1[i];
                const typeArgument = typeArgs2[i];

                if (typeParameter !== typeArgument) {
                    match = false;
                    break;
                }
            }

            if (match) {
                return true;
            }
        }

        // TODO: Implements `target`

        switch (this.declaration.kind) {
            case BoundNodeKind.ExternClassDeclaration:
            case BoundNodeKind.ClassDeclaration: {
                let ancestor = this.declaration.superType;
                while (ancestor) {
                    if (target === ancestor.type) {
                        return true;
                    }

                    ancestor = ancestor.superType;
                }
                break;
            }

            default:
                break;
        }

        // TODO: Unboxing conversions

        return false;
    }

    toString(): string {
        let str = '';

        str += this.declaration.identifier.name;

        if (this.declaration.kind === BoundNodeKind.ClassDeclaration) {
            const typeArguments = this.declaration.typeArguments || this.declaration.typeParameters;
            if (typeArguments) {
                str += '<';

                const typeArgumentNames: Types[] = [];
                for (const typeArgument of typeArguments) {
                    typeArgumentNames.push(typeArgument.type);
                }
                str += typeArgumentNames.join(',');

                str += '>';
            }
        }

        return str;
    }
}

export type ObjectTypeDeclaration =
    | BoundExternClassDeclaration
    | BoundInterfaceDeclaration
    | BoundClassDeclaration
    ;
