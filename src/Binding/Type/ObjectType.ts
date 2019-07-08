import { Type } from './Type';

export class ObjectType extends Type {
    static readonly type = new ObjectType();

    private constructor() {
        super('Object');
    }

    isConvertibleTo(target: Type): boolean {
        // TODO: If is Null, convertible to everything else.

        if (target === ObjectType.type) { return true; }

        // TODO: Implements `target`
        // TODO: `target` is super type
        // TODO: Unboxing conversions

        return false;
    }
}
