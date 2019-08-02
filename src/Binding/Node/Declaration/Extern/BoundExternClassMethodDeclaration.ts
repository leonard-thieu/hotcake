import { BoundSymbol, BoundSymbolTable } from '../../../BoundSymbol';
import { MethodType } from '../../../Type/FunctionLikeType';
import { BoundNode } from '../../BoundNode';
import { BoundNodeKind } from '../../BoundNodeKind';
import { BoundStringLiteralExpression } from '../../Expression/BoundStringLiteralExpression';
import { BoundDataDeclaration } from '../BoundDataDeclaration';
import { BoundTypeReferenceDeclaration } from '../BoundDeclarations';

export class BoundExternClassMethodDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ExternClassMethodDeclaration;

    identifier: BoundSymbol = undefined!;
    readonly locals = new BoundSymbolTable();
    type: MethodType = undefined!;

    returnType: BoundTypeReferenceDeclaration = undefined!;
    parameters: BoundDataDeclaration[] = undefined!;

    nativeSymbol?: BoundStringLiteralExpression = undefined;
}
