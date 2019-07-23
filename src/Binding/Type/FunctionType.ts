import { BoundClassMethodDeclaration } from '../Node/Declaration/BoundClassMethodDeclaration';
import { BoundFunctionDeclaration } from '../Node/Declaration/BoundFunctionDeclaration';
import { BoundInterfaceMethodDeclaration } from '../Node/Declaration/BoundInterfaceMethodDeclaration';
import { BoundExternClassMethodDeclaration } from '../Node/Declaration/Extern/BoundExternClassMethodDeclaration';
import { BoundExternFunctionDeclaration } from '../Node/Declaration/Extern/BoundExternFunctionDeclaration';
import { Type } from './Type';
import { TypeKind } from './TypeKind';
import { Types } from './Types';

export class FunctionType extends Type {
    constructor(readonly declaration: BoundFunctionDeclarations) {
        super();
    }

    readonly kind = TypeKind.Function;

    isConvertibleTo(target: Types): boolean {
        throw new Error('Method not implemented.');
    }

    toString(): string {
        let str = '';

        str += '(';
        const parameterTypes: Types[] = [];
        for (const parameter of this.declaration.parameters) {
            parameterTypes.push(parameter.type);
        }
        str += parameterTypes.join(',');
        str += ')';

        str += `: ${this.declaration.returnType}`;

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
