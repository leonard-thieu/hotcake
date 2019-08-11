import { ExternClassDeclaration, ExternClassMethodDeclaration } from '../../../../Syntax/Node/Declaration/ExternDeclaration/ExternClassDeclaration';
import { BoundSymbol, BoundSymbolTable } from '../../../BoundSymbol';
import { ArrayType } from '../../../Type/ArrayType';
import { MethodType } from '../../../Type/FunctionLikeType';
import { ObjectType } from '../../../Type/ObjectType';
import { StringType } from '../../../Type/StringType';
import { BoundNode, BoundNodeKind } from '../../BoundNodes';
import { BoundStringLiteralExpression } from '../../Expression/BoundStringLiteralExpression';
import { BoundClassDeclaration } from '../BoundClassDeclaration';
import { BoundDataDeclaration } from '../BoundDataDeclaration';
import { BoundTypeReferenceDeclaration } from '../BoundDeclarations';
import { BoundExternClassMethodGroupDeclaration, BoundExternFunctionGroupDeclaration } from '../BoundFunctionLikeGroupDeclaration';
import { BoundExternDataDeclaration } from './BoundExternDataDeclaration';

// #region Extern class declaration

export class BoundExternClassDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ExternClassDeclaration;

    declaration: ExternClassDeclaration = undefined!;

    identifier: BoundSymbol = undefined!;
    type: ObjectType | StringType | ArrayType = undefined!;

    superType?: BoundExternClassDeclaration | BoundClassDeclaration = undefined;
    nativeSymbol?: BoundStringLiteralExpression = undefined;

    readonly locals = new BoundSymbolTable();
}

export type BoundExternClassDeclarationMember =
    | BoundExternDataDeclaration
    | BoundExternFunctionGroupDeclaration
    | BoundExternClassMethodGroupDeclaration
    ;

// #endregion

// #region Extern class method declaration

export class BoundExternClassMethodDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ExternClassMethodDeclaration;

    declaration?: ExternClassMethodDeclaration = undefined;

    identifier: BoundSymbol = undefined!;
    readonly locals = new BoundSymbolTable();
    type: MethodType = undefined!;

    returnType: BoundTypeReferenceDeclaration = undefined!;
    parameters: BoundDataDeclaration[] = undefined!;

    nativeSymbol?: BoundStringLiteralExpression = undefined;
}

// #endregion
