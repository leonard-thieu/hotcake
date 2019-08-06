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
