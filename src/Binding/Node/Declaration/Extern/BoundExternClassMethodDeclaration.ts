import { BoundSymbol, BoundSymbolTable } from '../../../BoundSymbol';
import { MethodType } from '../../../Type/FunctionLikeType';
import { BoundNode } from '../../BoundNode';
import { BoundNodeKind } from '../../BoundNodeKind';
import { BoundStringLiteralExpression } from '../../Expression/BoundStringLiteralExpression';
import { BoundDataDeclaration } from '../BoundDataDeclaration';
import { BoundTypeDeclaration } from '../BoundDeclarations';

export class BoundExternClassMethodDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ExternClassMethodDeclaration;

    identifier: BoundSymbol = undefined!;
    locals: BoundSymbolTable = undefined!;
    type: MethodType = undefined!;

    returnType: BoundTypeDeclaration = undefined!;
    parameters: BoundDataDeclaration[] = undefined!;

    nativeSymbol?: BoundStringLiteralExpression = undefined;
}
