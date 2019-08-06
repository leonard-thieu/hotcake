import { getMethod } from '../Binder';
import { BoundNodeKind } from '../Node/BoundNodes';
import { BoundExternClassDeclaration } from '../Node/Declaration/Extern/BoundExternClassDeclaration';
import { Type } from './Type';
import { TypeKind, Types } from './Types';

export class StringType extends Type {
    constructor(readonly declaration: BoundExternClassDeclaration) {
        super();
    }

    readonly kind = TypeKind.String;

    isConvertibleTo(target: Types): boolean {
        switch (target.declaration.kind) {
            case BoundNodeKind.ExternClassDeclaration:
            case BoundNodeKind.ClassDeclaration: {
                const method = getMethod(target.declaration, 'New', undefined, this);
                if (method) {
                    return true;
                }
                break;
            }
        }

        switch (target.kind) {
            case TypeKind.String: {
                return true;
            }
        }

        return false;
    }
}
