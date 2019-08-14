import { CONSTRUCTOR_NAME } from '../Binder';
import { areIdentifiersSame } from '../BoundSymbol';
import { BoundNodeKind, BoundNodes } from '../Node/BoundNodes';
import { BoundClassMethodDeclaration } from '../Node/Declaration/BoundClassDeclaration';
import { BoundExternClassMethodDeclaration } from '../Node/Declaration/BoundExternClassDeclaration';
import { BoundExternFunctionDeclaration } from '../Node/Declaration/BoundExternFunctionDeclaration';
import { BoundFunctionDeclaration } from '../Node/Declaration/BoundFunctionDeclaration';
import { BoundFunctionGroupDeclaration, BoundMethodGroupDeclaration } from '../Node/Declaration/BoundFunctionLikeGroupDeclaration';
import { BoundInterfaceMethodDeclaration } from '../Node/Declaration/BoundInterfaceDeclaration';
import { Type, TypeKind, Types } from './Types';

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

    toString(): string {
        let str = '';

        str += this.declaration.identifier.name;
        str += `: ${this.declaration.returnType.type}`;
        str += '(';
        str += this.declaration.parameters.map((parameter) =>
            parameter.type
        ).join(',');
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

    isConvertibleTo(_target: Types): boolean {
        throw new Error(`'${this.kind}' types are not convertible.`);
    }
}

export class FunctionGroupType extends Type {
    constructor(readonly declaration: BoundFunctionGroupDeclaration) {
        super();
    }

    readonly kind = TypeKind.FunctionGroup;

    isConvertibleTo(_target: Types): boolean {
        throw new Error(`'${this.kind}' types are not convertible.`);
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

    isConvertibleTo(_target: Types): boolean {
        throw new Error(`'${this.kind}' types are not convertible.`);
    }

    toString(): string {
        if (areIdentifiersSame(CONSTRUCTOR_NAME, this.declaration.identifier.name)) {
            let str = '';

            str += `${CONSTRUCTOR_NAME} ${this.declaration.returnType.type}`;
            str += '(';
            str += this.declaration.parameters.map(p => p.type).join(',');
            str += ')';

            return str;
        }

        return super.toString();
    }
}

export class MethodGroupType extends Type {
    constructor(readonly declaration: BoundMethodGroupDeclaration) {
        super();
    }

    readonly kind = TypeKind.MethodGroup;

    isConvertibleTo(_target: Types): boolean {
        throw new Error(`'${this.kind}' types are not convertible.`);
    }

    toString(): string {
        for (const [, overload] of this.declaration.overloads) {
            const name = overload.identifier.name;

            if (areIdentifiersSame(CONSTRUCTOR_NAME, name)) {
                return `${CONSTRUCTOR_NAME} ${overload.returnType.type}`;
            }

            return name;
        }

        throw new Error(`Method group is empty.`);
    }
}

// #endregion
