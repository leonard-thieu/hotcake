import { BoundClassMethodDeclaration } from '../Node/Declaration/BoundClassMethodDeclaration';
import { BoundFunctionDeclaration } from '../Node/Declaration/BoundFunctionDeclaration';
import { BoundInterfaceMethodDeclaration } from '../Node/Declaration/BoundInterfaceMethodDeclaration';
import { BoundExternClassMethodDeclaration } from '../Node/Declaration/Extern/BoundExternClassMethodDeclaration';
import { BoundExternFunctionDeclaration } from '../Node/Declaration/Extern/BoundExternFunctionDeclaration';
import { Type } from './Type';
import { TypeKind } from './TypeKind';
import { Types } from './Types';

export class FunctionType extends Type {
    readonly kind = TypeKind.Function;

    declaration: BoundFunctionDeclarations = undefined!;
    returnType: Types = undefined!;
    parameters: Types[] = undefined!;

    isConvertibleTo(target: Types): boolean {
        throw new Error('Method not implemented.');
    }

    toString(): string {
        let str = '';

        str += '(';
        str += this.parameters.join(',');
        str += ')';

        str += `: ${this.returnType}`;

        return str;
    }
}

export type BoundFunctionDeclarations =
    | BoundExternFunctionDeclaration
    | BoundExternClassMethodDeclaration
    | BoundFunctionDeclaration
    | BoundInterfaceMethodDeclaration
    | BoundClassMethodDeclaration
    ;
