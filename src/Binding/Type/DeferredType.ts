import { Type, TypeKind, Types } from './Types';

export class DeferredType extends Type {
    readonly kind = TypeKind.Deferred;

    get declaration(): never {
        throw new Error(`Assertion failed: attempted to get declaration of deferred type.`);
    }

    isConvertibleTo(_target: Types): boolean {
        return true;
    }
}
