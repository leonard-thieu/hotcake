import { Type } from './Type';

export class ObjectType extends Type {
    static readonly type = new ObjectType();
    static readonly nullType = new ObjectType();

    private constructor() {
        super('Object');
    }

    isConvertibleTo(target: Type): boolean {
        if (target === ObjectType.nullType) { return true; }
        if (target === this) { return true; }

        // TODO: Implements `target`
        // TODO: `target` is super type
        // TODO: Unboxing conversions

        return false;
    }
}
