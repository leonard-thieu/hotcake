import { BoundSymbol } from '../BoundSymbol';
import { Type } from './Type';
import { TypeKind } from './TypeKind';
import { Types } from './Types';

export class VoidType extends Type {
    static readonly type = new VoidType();

    private constructor() {
        super();

        this.identifier = new BoundSymbol('Void', this);
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
