import { BoundTypeParameter } from '../Node/Declaration/BoundTypeParameter';
import { Type } from './Type';
import { TypeKind } from './TypeKind';
import { Types } from './Types';

export class GenericType extends Type {
    constructor(readonly declaration: BoundTypeParameter) {
        super();
    }

    readonly kind = TypeKind.Generic;

    isConvertibleTo(target: Types): boolean {
        throw new Error('Method not implemented.');
    }
}
