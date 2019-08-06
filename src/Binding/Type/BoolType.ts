import { BoundIntrinsicTypeDeclaration } from '../Node/Declaration/BoundIntrinsicTypeDeclaration';
import { Type } from './Type';
import { TypeKind, Types } from './Types';

export class BoolType extends Type {
    constructor(readonly declaration: BoundIntrinsicTypeDeclaration) {
        super();
    }

    readonly kind = TypeKind.Bool;

    isConvertibleTo(target: Types): boolean {
        // TODO: Boxing conversion

        switch (target.kind) {
            case TypeKind.Bool:
            case TypeKind.Int: {
                return true;
            }
        }

        return false;
    }
}
