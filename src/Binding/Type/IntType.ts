import { CONSTRUCTOR_NAME } from '../Binder';
import { BoundTreeWalker } from '../BoundTreeWalker';
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
                const method = BoundTreeWalker.getMethod(target.declaration, CONSTRUCTOR_NAME, undefined, this);
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
