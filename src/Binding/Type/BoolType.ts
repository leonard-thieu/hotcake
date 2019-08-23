import { CONSTRUCTOR_NAME } from '../Binder';
import { BoundTreeWalker } from '../BoundTreeWalker';
import { BoundNodeKind } from '../Node/BoundNodes';
import { BoundIntrinsicTypeDeclaration } from '../Node/Declaration/BoundIntrinsicTypeDeclaration';
import { Type, TypeKind, Types } from './Types';

export class BoolType extends Type {
    constructor(readonly declaration: BoundIntrinsicTypeDeclaration) {
        super();
    }

    readonly kind = TypeKind.Bool;

    isConvertibleTo(target: Types): boolean {
        switch (target.declaration.kind) {
            case BoundNodeKind.ExternClassDeclaration:
            case BoundNodeKind.ClassDeclaration: {
                const method = BoundTreeWalker.getSpecialMethod(target.declaration, CONSTRUCTOR_NAME, undefined, this);
                if (method) {
                    return true;
                }
                break;
            }
        }

        switch (target.kind) {
            case TypeKind.Bool:
            case TypeKind.Int: {
                return true;
            }
        }

        return false;
    }
}
