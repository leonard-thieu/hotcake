import { BoundSymbol } from '../BoundSymbol';
import { BoundExternClassDeclaration } from '../Node/Declaration/Extern/BoundExternClassDeclaration';
import { ObjectType } from './ObjectType';
import { Type } from './Type';
import { TypeKind } from './TypeKind';
import { Types } from './Types';

export class StringType extends Type {
    readonly kind = TypeKind.String;

    declaration: BoundExternClassDeclaration = undefined!;
    identifier: BoundSymbol = undefined!;
    superType?: ObjectType = undefined;

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
