import { BoundNodes } from '../Node/BoundNode';
import { BoundNodeKind } from '../Node/BoundNodeKind';
import { BoundClassMethodDeclaration } from '../Node/Declaration/BoundClassMethodDeclaration';
import { BoundFunctionDeclaration } from '../Node/Declaration/BoundFunctionDeclaration';
import { BoundInterfaceMethodDeclaration } from '../Node/Declaration/BoundInterfaceMethodDeclaration';
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

    returnType: Types = undefined!;
    parameters: Types[] = undefined!;

    get parent(): FunctionLikeGroupType {
        return this.identifier.type as FunctionLikeGroupType;
    }

    isConvertibleTo(target: Types): boolean {
        throw new Error('Method not implemented.');
    }

    toString(): string {
        let str = '';

        if (this.parent.isMethod &&
            this.identifier.name.toLowerCase() === 'new'
        ) {
            str += `New ${this.returnType}`;
        } else {
            str += this.identifier.name;
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
    readonly kind = TypeKind.FunctionLikeGroup;

    isMethod: boolean = false;
    readonly members: FunctionLikeType[] = [];
    typeArguments?: Types[] = undefined;

    readonly instantiatedTypes: FunctionLikeGroupType[] = [];

    isConvertibleTo(target: Types): boolean {
        throw new Error('Method not implemented.');
    }

    toString(): string {
        if (this.isMethod &&
            this.identifier.name.toLowerCase() === 'new'
        ) {
            const returnType = this.members[0].returnType;

            return `New ${returnType}`;
        }

        return this.identifier.name;
    }
}
