import { assertNever } from '../../assertNever';
import { BoundSymbol } from '../BoundSymbol';
import { BoundNodes } from '../Node/BoundNode';
import { BoundNodeKind } from '../Node/BoundNodeKind';
import { BoundClassDeclaration } from '../Node/Declaration/BoundClassDeclaration';
import { BoundClassMethodDeclaration } from '../Node/Declaration/BoundClassMethodDeclaration';
import { BoundFunctionDeclaration } from '../Node/Declaration/BoundFunctionDeclaration';
import { BoundInterfaceMethodDeclaration } from '../Node/Declaration/BoundInterfaceMethodDeclaration';
import { BoundExternClassDeclaration } from '../Node/Declaration/Extern/BoundExternClassDeclaration';
import { BoundExternClassMethodDeclaration } from '../Node/Declaration/Extern/BoundExternClassMethodDeclaration';
import { BoundExternFunctionDeclaration } from '../Node/Declaration/Extern/BoundExternFunctionDeclaration';
import { Type } from './Type';
import { TypeKind } from './TypeKind';
import { Types } from './Types';

export function isFunctionLike(node: BoundNodes): node is BoundFunctionLikeDeclaration {
    switch (node.kind) {
        case BoundNodeKind.ExternFunctionDeclaration:
        case BoundNodeKind.ExternClassMethodDeclaration:
        case BoundNodeKind.FunctionDeclaration:
        case BoundNodeKind.InterfaceMethodDeclaration:
        case BoundNodeKind.ClassMethodDeclaration: {
            return true;
        }
    }

    return false;
}

export class FunctionLikeType extends Type {
    readonly kind = TypeKind.FunctionLike;

    declaration: BoundFunctionLikeDeclaration = undefined!;
    returnType: Types = undefined!;
    parameters: Types[] = undefined!;

    get isMethod() {
        switch (this.declaration.kind) {
            case BoundNodeKind.ExternClassMethodDeclaration:
            case BoundNodeKind.InterfaceMethodDeclaration:
            case BoundNodeKind.ClassMethodDeclaration: {
                return true;
            }

            case BoundNodeKind.ExternFunctionDeclaration:
            case BoundNodeKind.FunctionDeclaration: {
                return false;
            }

            default: {
                return assertNever(this.declaration);
            }
        }
    }

    isConvertibleTo(target: Types): boolean {
        throw new Error('Method not implemented.');
    }

    toString(): string {
        let str = '';

        const { name } = this.declaration.identifier;
        if (name.toLowerCase() === 'new') {
            const parent = this.declaration.parent! as BoundExternClassDeclaration | BoundClassDeclaration;
            str += `New ${parent.type}`;
        } else {
            str += name;
            str += `: ${this.returnType}`;
        }

        str += '(';
        str += this.parameters.join(',');
        str += ')';

        return str;
    }
}

export type BoundFunctionLikeDeclaration =
    | BoundExternFunctionDeclaration
    | BoundExternClassMethodDeclaration
    | BoundFunctionDeclaration
    | BoundInterfaceMethodDeclaration
    | BoundClassMethodDeclaration
    ;

export class FunctionLikeGroupType extends Type {
    constructor(readonly identifier: BoundSymbol) {
        super();
    }

    readonly kind = TypeKind.FunctionLikeGroup;

    isConvertibleTo(target: Types): boolean {
        throw new Error('Method not implemented.');
    }

    toString(): string {
        return this.identifier.name;
    }
}
