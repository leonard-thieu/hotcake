import { IntType } from './IntType';
import { StringType } from './StringType';
import { Type } from './Type';

export class FloatType extends Type {
    static readonly type = new FloatType();

    private constructor() {
        super('Float');
    }

    isConvertibleTo(target: Type): boolean {
        // TODO: Boxing conversion

        if (target === IntType.type) { return true; }
        if (target === FloatType.type) { return true; }
        if (target === StringType.type) { return true; }

        return false;
    }
}
