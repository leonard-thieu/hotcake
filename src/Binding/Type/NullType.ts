import { BoundIntrinsicTypeDeclaration } from '../Node/Declaration/BoundIntrinsicTypeDeclaration';
import { Type } from './Type';
import { TypeKind, Types } from './Types';

export class NullType extends Type {
    constructor(readonly declaration: BoundIntrinsicTypeDeclaration) {
        super();
    }

    readonly kind = TypeKind.Null;

    isConvertibleTo(target: Types): boolean {
        if (target.kind === TypeKind.Object) { return true; }
        if (target === this) { return true; }

        return false;
    }

    toString(): string {
        return 'Null';
    }
}
