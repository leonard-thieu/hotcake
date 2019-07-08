import { Type } from './Type';

export class VoidType extends Type {
    static readonly type = new VoidType();

    private constructor() {
        super('Void');
    }

    isConvertibleTo(target: Type): boolean {
        if (target === VoidType.type) { return true; }

        return false;
    }
}
