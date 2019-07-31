import { BoundExternClassDeclaration } from '../Node/Declaration/Extern/BoundExternClassDeclaration';
import { Type } from './Type';
import { TypeKind } from './TypeKind';
import { Types } from './Types';

export class StringType extends Type {
    constructor(readonly declaration: BoundExternClassDeclaration) {
        super();
    }

    readonly kind = TypeKind.String;

    isConvertibleTo(target: Types): boolean {
        // TODO: Boxing conversion

        switch (target.kind) {
            case TypeKind.String: {
                return true;
            }
        }

        return false;
    }
}
