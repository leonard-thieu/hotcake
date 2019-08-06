import { BoundNodeKind } from '../Node/BoundNodes';
import { BoundClassDeclaration } from '../Node/Declaration/BoundClassDeclaration';
import { BoundInterfaceDeclaration } from '../Node/Declaration/BoundInterfaceDeclaration';
import { BoundExternClassDeclaration } from '../Node/Declaration/Extern/BoundExternClassDeclaration';
import { Type } from './Type';
import { TypeKind, Types } from './Types';

export class ObjectType extends Type {
    constructor(readonly declaration: ObjectTypeDeclaration) {
        super();
    }

    readonly kind = TypeKind.Object;

    isConvertibleTo(target: Types): boolean {
        if (target.kind === TypeKind.Null) { return true; }
        if (target === this) { return true; }

        switch (target.declaration.kind) {
            case BoundNodeKind.InterfaceDeclaration: {
                switch (this.declaration.kind) {
                    case BoundNodeKind.InterfaceDeclaration:
                    case BoundNodeKind.ClassDeclaration: {
                        if (this.declaration.implementedTypes) {
                            for (const implementedType of this.declaration.implementedTypes) {
                                if (implementedType.type.isConvertibleTo(target)) {
                                    return true;
                                }
                            }
                        }

                        if (this.declaration.kind === BoundNodeKind.ClassDeclaration &&
                            this.declaration.superType &&
                            this.declaration.superType.type.isConvertibleTo(target)
                        ) {
                            return true;
                        }
                        break;
                    }
                }
                break;
            }
            case BoundNodeKind.ExternClassDeclaration:
            case BoundNodeKind.ClassDeclaration: {
                switch (this.declaration.kind) {
                    case BoundNodeKind.ExternClassDeclaration:
                    case BoundNodeKind.ClassDeclaration: {
                        if (this.declaration.superType) {
                            if (this.declaration.superType.type.isConvertibleTo(target)) {
                                return true;
                            }
                        }
                        break;
                    }
                }
                break;
            }
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
