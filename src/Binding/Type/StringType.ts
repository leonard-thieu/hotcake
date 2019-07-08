import { Type } from './Type';

export class StringType extends Type {
    static readonly type = new StringType();

    private constructor() {
        super('String');
    }

    isConvertibleTo(target: Type): boolean {
        // TODO: Boxing conversion

        if (target === StringType.type) { return true; }

        return false;
    }
}
