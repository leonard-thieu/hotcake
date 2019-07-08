import { IntType } from './IntType';
import { Type } from './Type';

export class BoolType extends Type {
    static readonly type = new BoolType();

    private constructor() {
        super('Bool');
    }

    isConvertibleTo(target: Type): boolean {
        // TODO: Boxing conversion

        if (target === BoolType.type) { return true; }
        if (target === IntType.type) { return true; }

        return false;
    }
}
