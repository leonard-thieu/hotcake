import { FloatType } from './FloatType';
import { StringType } from './StringType';
import { Type } from './Type';

export class IntType extends Type {
    static readonly type = new IntType();

    private constructor() {
        super('Int');
    }

    isConvertibleTo(target: Type): boolean {
        // TODO: Boxing conversion

        if (target === IntType.type) { return true; }
        if (target === FloatType.type) { return true; }
        if (target === StringType.type) { return true; }

        return false;
    }
}
