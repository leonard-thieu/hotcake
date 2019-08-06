import { getMethod } from '../Binder';
import { BoundNodeKind } from '../Node/BoundNodes';
import { BoundIntrinsicTypeDeclaration } from '../Node/Declaration/BoundIntrinsicTypeDeclaration';
import { Type } from './Type';
import { TypeKind, Types } from './Types';

export class IntType extends Type {
    constructor(readonly declaration: BoundIntrinsicTypeDeclaration) {
        super();
    }

    readonly kind = TypeKind.Int;

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
            case TypeKind.Int:
            case TypeKind.Float:
            case TypeKind.String: {
                return true;
            }
        }

        return false;
    }
}
