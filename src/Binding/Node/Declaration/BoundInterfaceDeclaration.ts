import { InterfaceDeclaration, InterfaceMethodDeclaration } from '../../../Syntax/Node/Declaration/InterfaceDeclaration';
import { BoundSymbol, BoundSymbolTable } from '../../BoundSymbol';
import { MethodType } from '../../Type/FunctionLikeType';
import { ObjectType } from '../../Type/ObjectType';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundTypeReferenceDeclaration } from './BoundDeclarations';

// #region Bound interface declaration

export class BoundInterfaceDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.InterfaceDeclaration;

    declaration: InterfaceDeclaration = undefined!;

    identifier: BoundSymbol = undefined!;
    type: ObjectType = undefined!;

    baseTypes?: BoundInterfaceDeclaration[] = undefined;

    readonly locals = new BoundSymbolTable();
}

// #endregion

// #region Bound interface method declaration

export class BoundInterfaceMethodDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.InterfaceMethodDeclaration;

    declaration: InterfaceMethodDeclaration = undefined!;

    identifier: BoundSymbol = undefined!;
    readonly locals = new BoundSymbolTable();
    type: MethodType = undefined!;

    returnType: BoundTypeReferenceDeclaration = undefined!;
    parameters: BoundDataDeclaration[] = undefined!;
}

// #endregion
