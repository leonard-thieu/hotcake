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
        let str = this.declaration.identifier.name;

        if (this.declaration.kind === BoundNodeKind.ClassDeclaration) {
            // if (this.declaration.typeArguments) {
            //     str += '<';

            //     const argNames: Types[] = [];
            //     for (const arg of this.declaration.typeArguments) {
            //         argNames.push(arg.type);
            //     }
            //     str += argNames.join(',');

            //     str += '>';
            // } else
            if (this.declaration.typeParameters) {
                str += '<';

                const argNames: Types[] = [];
                for (const arg of this.declaration.typeParameters) {
                    argNames.push(arg.type);
                }
                str += argNames.join(',');

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
