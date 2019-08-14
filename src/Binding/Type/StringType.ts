import { CONSTRUCTOR_NAME } from '../Binder';
import { BoundTreeWalker } from '../BoundTreeWalker';
import { BoundNodeKind } from '../Node/BoundNodes';
import { BoundExternClassDeclaration } from '../Node/Declaration/BoundExternClassDeclaration';
import { Type, TypeKind, Types } from './Types';

export class StringType extends Type {
    constructor(readonly declaration: BoundExternClassDeclaration) {
        super();
    }

    readonly kind = TypeKind.String;

    isConvertibleTo(target: Types): boolean {
        switch (target.declaration.kind) {
            case BoundNodeKind.ExternClassDeclaration:
            case BoundNodeKind.ClassDeclaration: {
                const method = BoundTreeWalker.getMethod(target.declaration, CONSTRUCTOR_NAME, undefined, this);
                if (method) {
                    return true;
                }
                break;
            }
        }

        switch (target.kind) {
            case TypeKind.String: {
                return true;
            }
        }

        return false;
    }
}
