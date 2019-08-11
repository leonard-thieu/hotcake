import { BoundIntrinsicTypeDeclaration } from '../Node/Declaration/BoundIntrinsicTypeDeclaration';
import { Type, TypeKind, Types } from './Types';

export class VoidType extends Type {
    constructor(readonly declaration: BoundIntrinsicTypeDeclaration) {
        super();
    }

    readonly kind = TypeKind.Void;

    isConvertibleTo(target: Types): boolean {
        switch (target.kind) {
            case TypeKind.Void: {
                return true;
            }
        }

        return false;
    }
}
