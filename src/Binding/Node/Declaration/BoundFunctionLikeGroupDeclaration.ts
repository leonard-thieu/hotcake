import { BoundSymbol } from '../../BoundSymbol';
import { BoundFunctionLikeDeclaration, FunctionGroupType, MethodGroupType } from '../../Type/FunctionLikeType';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundClassMethodDeclaration } from './BoundClassDeclaration';
import { BoundFunctionDeclaration } from './BoundFunctionDeclaration';
import { BoundInterfaceMethodDeclaration } from './BoundInterfaceDeclaration';
import { BoundExternClassMethodDeclaration } from './Extern/BoundExternClassDeclaration';
import { BoundExternFunctionDeclaration } from './Extern/BoundExternFunctionDeclaration';

export type BoundFunctionLikeGroupDeclaration =
    | BoundFunctionGroupDeclarations
    | BoundMethodGroupDeclaration
    ;

export type BoundFunctionGroupDeclarations =
    | BoundExternFunctionGroupDeclaration
    | BoundFunctionGroupDeclaration
    ;

export type BoundMethodGroupDeclaration =
    | BoundExternClassMethodGroupDeclaration
    | BoundInterfaceMethodGroupDeclaration
    | BoundClassMethodGroupDeclaration
    ;

export class BoundExternFunctionGroupDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ExternFunctionGroupDeclaration;

    identifier: BoundSymbol = undefined!;
    type: FunctionGroupType = undefined!;
    readonly overloads = new Overloads<BoundExternFunctionDeclaration>();
}

export class BoundExternClassMethodGroupDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ExternClassMethodGroupDeclaration;

    identifier: BoundSymbol = undefined!;
    type: MethodGroupType = undefined!;
    readonly overloads = new Overloads<BoundExternClassMethodDeclaration>();
}

export class BoundFunctionGroupDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.FunctionGroupDeclaration;

    identifier: BoundSymbol = undefined!;
    type: FunctionGroupType = undefined!;
    readonly overloads = new Overloads<BoundFunctionDeclaration>();
}

export class BoundInterfaceMethodGroupDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.InterfaceMethodGroupDeclaration;

    identifier: BoundSymbol = undefined!;
    type: MethodGroupType = undefined!;
    readonly overloads = new Overloads<BoundInterfaceMethodDeclaration>();
}

export class BoundClassMethodGroupDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ClassMethodGroupDeclaration;

    identifier: BoundSymbol = undefined!;
    type: MethodGroupType = undefined!;
    readonly overloads = new Overloads<BoundClassMethodDeclaration>();
}

export class Overloads<
    TBound extends BoundFunctionLikeDeclaration,
    TSyntax extends TBound['declaration'] = TBound['declaration'],
    > extends Map<TSyntax, TBound> {
    set(value: TBound): this;
    set(key: TSyntax, value: TBound): this;
    set(key_value: TSyntax | TBound, value?: TBound): this {
        let key: TSyntax;

        if ('declaration' in key_value) {
            key = key_value.declaration as TSyntax;
            value = key_value;
        } else {
            key = key_value;
            value = value!;
        }

        return super.set(key, value);
    }
}