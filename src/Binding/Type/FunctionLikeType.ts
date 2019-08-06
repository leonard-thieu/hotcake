import { normalizeIdentifier } from '../BoundSymbol';
import { BoundNodes } from '../Node/BoundNode';
import { BoundNodeKind } from '../Node/BoundNodeKind';
import { BoundClassMethodDeclaration } from '../Node/Declaration/BoundClassMethodDeclaration';
import { BoundFunctionDeclaration } from '../Node/Declaration/BoundFunctionDeclaration';
import { BoundClassMethodGroupDeclaration, BoundExternClassMethodGroupDeclaration, BoundExternFunctionGroupDeclaration, BoundFunctionGroupDeclaration, BoundInterfaceMethodGroupDeclaration } from '../Node/Declaration/BoundFunctionLikeGroupDeclaration';
import { BoundInterfaceMethodDeclaration } from '../Node/Declaration/BoundInterfaceMethodDeclaration';
import { BoundExternClassMethodDeclaration } from '../Node/Declaration/Extern/BoundExternClassMethodDeclaration';
import { BoundExternFunctionDeclaration } from '../Node/Declaration/Extern/BoundExternFunctionDeclaration';
import { Type } from './Type';
import { TypeKind } from './TypeKind';
import { Types } from './Types';

// #region Function like

export type FunctionLikeTypes =
    | FunctionType
    | MethodType
    ;

export type BoundFunctionLikeDeclaration =
    | BoundFunctionDeclarations
    | BoundMethodDeclaration
    ;

export function isBoundFunctionLikeDeclaration(node: BoundNodes): node is BoundFunctionLikeDeclaration {
    return isBoundFunctionDeclarations(node) ||
        isBoundMethodDeclaration(node);
}

abstract class FunctionLikeType extends Type {
    constructor(readonly declaration: BoundFunctionLikeDeclaration) {
        super();
    }

    isConvertibleTo(target: Types): boolean {
        throw new Error('Method not implemented.');
    }

    toString(): string {
        let str = '';

        str += this.declaration.identifier.name;
        str += `: ${this.declaration.returnType.type}`;
        str += '(';
        str += this.declaration.parameters.map(p => p.type).join(',');
        str += ')';

        return str;
    }
}

// #endregion

// #region Function

export type BoundFunctionDeclarations =
    | BoundExternFunctionDeclaration
    | BoundFunctionDeclaration
    ;

export function isBoundFunctionDeclarations(node: BoundNodes): node is BoundFunctionDeclarations {
    switch (node.kind) {
        case BoundNodeKind.ExternFunctionDeclaration:
        case BoundNodeKind.FunctionDeclaration: {
            return true;
        }
    }

    return false;
}

export class FunctionType extends FunctionLikeType {
    constructor(declaration: BoundFunctionDeclarations) {
        super(declaration);
    }

    readonly kind = TypeKind.Function;
}

export class FunctionGroupType extends Type {
    constructor(readonly declaration: BoundExternFunctionGroupDeclaration | BoundFunctionGroupDeclaration) {
        super();
    }

    readonly kind = TypeKind.FunctionGroup;

    isConvertibleTo(target: Types): boolean {
        throw new Error('Method not implemented.');
    }

    toString(): string {
        for (const [, overload] of this.declaration.overloads) {
            return overload.identifier.name;
        }

        throw new Error(`Function group is empty.`);
    }
}

// #endregion

// #region Method

export type BoundMethodDeclaration =
    | BoundExternClassMethodDeclaration
    | BoundInterfaceMethodDeclaration
    | BoundClassMethodDeclaration
    ;

export function isBoundMethodDeclaration(node: BoundNodes): node is BoundMethodDeclaration {
    switch (node.kind) {
        case BoundNodeKind.ExternClassMethodDeclaration:
        case BoundNodeKind.InterfaceMethodDeclaration:
        case BoundNodeKind.ClassMethodDeclaration: {
            return true;
        }
    }

    return false;
}

export class MethodType extends FunctionLikeType {
    constructor(readonly declaration: BoundMethodDeclaration) {
        super(declaration);
    }

    readonly kind = TypeKind.Method;

    toString(): string {
        if (normalizeIdentifier(this.declaration.identifier.name) === 'New') {
            let str = '';

            str += `New ${this.declaration.returnType.type}`;
            str += '(';
            str += this.declaration.parameters.map(p => p.type).join(',');
            str += ')';

            return str;
        }

        return super.toString();
    }
}

export class MethodGroupType extends Type {
    constructor(readonly declaration: BoundExternClassMethodGroupDeclaration | BoundInterfaceMethodGroupDeclaration | BoundClassMethodGroupDeclaration) {
        super();
    }

    readonly kind = TypeKind.MethodGroup;

    isConvertibleTo(target: Types): boolean {
        throw new Error('Method not implemented.');
    }

    toString(): string {
        for (const [, overload] of this.declaration.overloads) {
            const name = overload.identifier.name;

            if (normalizeIdentifier(name) === 'New') {
                return `New ${overload.returnType.type}`;
            }

            return name;
        }

        throw new Error(`Method group is empty.`);
    }
}

// #endregion
