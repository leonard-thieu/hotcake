import { BoundNodeKind } from '../Node/BoundNodeKind';
import { BoundClassDeclaration } from '../Node/Declaration/BoundClassDeclaration';
import { BoundInterfaceDeclaration } from '../Node/Declaration/BoundInterfaceDeclaration';
import { BoundExternClassDeclaration } from '../Node/Declaration/Extern/BoundExternClassDeclaration';
import { Type } from './Type';
import { TypeKind } from './TypeKind';
import { Types } from './Types';

export class ObjectType extends Type {
    static readonly type = new ObjectType();
    static readonly nullType = new ObjectType();

    constructor(readonly declaration?: BoundExternClassDeclaration | BoundInterfaceDeclaration | BoundClassDeclaration) {
        super();
    }

    readonly kind = TypeKind.Object;

    isConvertibleTo(target: Types): boolean {
        if (target === ObjectType.nullType) { return true; }
        if (target === this) { return true; }

        // TODO: Implements `target`

        if (this.declaration) {
            switch (this.declaration.kind) {
                case BoundNodeKind.ClassDeclaration: {
                    let superType = this.declaration.baseType as ObjectType | undefined;
                    while (superType) {
                        if (target === superType) {
                            return true;
                        }

                        if (!superType.declaration) {
                            break;
                        }

                        superType = (superType.declaration as BoundClassDeclaration).baseType as ObjectType | undefined;
                    }
                    break;
                }
            }
        }

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
