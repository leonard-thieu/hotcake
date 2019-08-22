import { BoundSymbol } from '../../BoundSymbol';
import { BoundFunctionLikeDeclaration, FunctionGroupType, MethodGroupType } from '../../Type/FunctionLikeType';
import { BoundNode, BoundNodeKind } from '../BoundNodes';
import { BoundClassMethodDeclaration } from './BoundClassDeclaration';
import { BoundExternClassMethodDeclaration } from './BoundExternClassDeclaration';
import { BoundExternFunctionDeclaration } from './BoundExternFunctionDeclaration';
import { BoundFunctionDeclaration } from './BoundFunctionDeclaration';
import { BoundInterfaceMethodDeclaration } from './BoundInterfaceDeclaration';

export type BoundFunctionLikeGroupDeclaration =
    | BoundFunctionGroupDeclaration
    | BoundMethodGroupDeclaration
    ;

export class BoundFunctionGroupDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.FunctionGroupDeclaration;

    identifier: BoundSymbol = undefined!;
    type: FunctionGroupType = undefined!;
    readonly overloads = new Overloads<BoundExternFunctionDeclaration | BoundFunctionDeclaration>();
}

export type BoundMethodGroupDeclaration =
    | BoundExternClassMethodGroupDeclaration
    | BoundInterfaceMethodGroupDeclaration
    | BoundClassMethodGroupDeclaration
    ;

export class BoundExternClassMethodGroupDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ExternClassMethodGroupDeclaration;

    identifier: BoundSymbol = undefined!;
    type: MethodGroupType = undefined!;
    readonly overloads = new Overloads<BoundExternClassMethodDeclaration>();
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
    > extends Map<TSyntax, TBound>
{
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
