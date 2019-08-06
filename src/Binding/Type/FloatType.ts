import { BoundIntrinsicTypeDeclaration } from '../Node/Declaration/BoundIntrinsicTypeDeclaration';
import { Type } from './Type';
import { TypeKind, Types } from './Types';

export class FloatType extends Type {
    constructor(readonly declaration: BoundIntrinsicTypeDeclaration) {
        super();
    }

    readonly kind = TypeKind.Float;

    isConvertibleTo(target: Types): boolean {
        // TODO: Boxing conversion

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
