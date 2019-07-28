import { BoundSymbol } from '../BoundSymbol';
import { Type } from './Type';
import { TypeKind } from './TypeKind';
import { Types } from './Types';

export class IntType extends Type {
    static readonly type = new IntType();

    private constructor() {
        super();

        this.identifier = new BoundSymbol('Int', this);
    }

    readonly kind = TypeKind.Int;

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
