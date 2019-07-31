import { BoundSymbol } from '../../BoundSymbol';
import { FunctionGroupType, MethodGroupType } from '../../Type/FunctionLikeType';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundClassMethodDeclaration } from './BoundClassMethodDeclaration';
import { BoundFunctionDeclaration } from './BoundFunctionDeclaration';
import { BoundInterfaceMethodDeclaration } from './BoundInterfaceMethodDeclaration';
import { BoundExternClassMethodDeclaration } from './Extern/BoundExternClassMethodDeclaration';
import { BoundExternFunctionDeclaration } from './Extern/BoundExternFunctionDeclaration';

export type BoundFunctionLikeGroupDeclaration =
    | BoundExternFunctionGroupDeclaration
    | BoundExternClassMethodGroupDeclaration
    | BoundFunctionGroupDeclaration
    | BoundInterfaceMethodGroupDeclaration
    | BoundClassMethodGroupDeclaration
    ;

export class BoundExternFunctionGroupDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ExternFunctionGroupDeclaration;

    identifier: BoundSymbol = undefined!;
    type: FunctionGroupType = undefined!;
    readonly overloads = new Set<BoundExternFunctionDeclaration>();
}

export class BoundExternClassMethodGroupDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ExternClassMethodGroupDeclaration;

    identifier: BoundSymbol = undefined!;
    type: MethodGroupType = undefined!;
    readonly overloads = new Set<BoundExternClassMethodDeclaration>();
}

export class BoundFunctionGroupDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.FunctionGroupDeclaration;

    identifier: BoundSymbol = undefined!;
    type: FunctionGroupType = undefined!;
    readonly overloads = new Set<BoundFunctionDeclaration>();
}

export class BoundInterfaceMethodGroupDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.InterfaceMethodGroupDeclaration;

    identifier: BoundSymbol = undefined!;
    type: MethodGroupType = undefined!;
    readonly overloads = new Set<BoundInterfaceMethodDeclaration>();
}

export class BoundClassMethodGroupDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ClassMethodGroupDeclaration;

    identifier: BoundSymbol = undefined!;
    type: MethodGroupType = undefined!;
    readonly overloads = new Set<BoundClassMethodDeclaration>();
}