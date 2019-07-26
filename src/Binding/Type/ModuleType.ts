import { BoundSymbol } from '../BoundSymbol';
import { BoundModuleDeclaration } from '../Node/Declaration/BoundModuleDeclaration';
import { Type } from './Type';
import { TypeKind } from './TypeKind';
import { Types } from './Types';

export class ModuleType extends Type {
    readonly kind = TypeKind.Module;

    declaration: BoundModuleDeclaration = undefined!;
    identifier: BoundSymbol = undefined!;

    isConvertibleTo(target: Types): boolean {
        throw new Error('Method not implemented.');
    }
}
