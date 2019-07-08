import { Type } from './Type';

export class ArrayType extends Type {
    static readonly type = new ArrayType();

    private constructor() {
        super('Array');
    }

    isConvertibleTo(target: Type): boolean {
        if (target === ArrayType.type) {
            // TODO: Same element type or Void element type
        }

        return false;
    }
}
