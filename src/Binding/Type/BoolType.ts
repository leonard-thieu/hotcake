import { BoundSymbol } from '../BoundSymbol';
import { Type } from './Type';
import { TypeKind } from './TypeKind';
import { Types } from './Types';

export class BoolType extends Type {
    static readonly type = new BoolType();

    private constructor() {
        super();

        this.identifier = new BoundSymbol('Bool', this);
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
