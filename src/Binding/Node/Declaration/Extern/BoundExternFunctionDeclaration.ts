import { ExternFunctionDeclaration } from '../../../../Syntax/Node/Declaration/ExternDeclaration/ExternFunctionDeclaration';
import { BoundSymbol, BoundSymbolTable } from '../../../BoundSymbol';
import { FunctionType } from '../../../Type/FunctionLikeType';
import { BoundNode } from '../../BoundNode';
import { BoundNodeKind } from '../../BoundNodeKind';
import { BoundStringLiteralExpression } from '../../Expression/BoundStringLiteralExpression';
import { BoundDataDeclaration } from '../BoundDataDeclaration';
import { BoundTypeReferenceDeclaration } from '../BoundDeclarations';

export class BoundExternFunctionDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ExternFunctionDeclaration;

    declaration: ExternFunctionDeclaration = undefined!;

    identifier: BoundSymbol = undefined!;
    readonly locals = new BoundSymbolTable();
    type: FunctionType = undefined!;

    returnType: BoundTypeReferenceDeclaration = undefined!;
    parameters: BoundDataDeclaration[] = undefined!;

    nativeSymbol?: BoundStringLiteralExpression = undefined;
}
