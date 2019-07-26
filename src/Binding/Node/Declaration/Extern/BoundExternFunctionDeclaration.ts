import { BoundSymbol, BoundSymbolTable } from '../../../BoundSymbol';
import { FunctionLikeType } from '../../../Type/FunctionLikeType';
import { Types } from '../../../Type/Types';
import { BoundNode } from '../../BoundNode';
import { BoundNodeKind } from '../../BoundNodeKind';
import { BoundStringLiteralExpression } from '../../Expression/BoundStringLiteralExpression';
import { BoundDataDeclaration } from '../BoundDataDeclaration';

export class BoundExternFunctionDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ExternFunctionDeclaration;

    identifier: BoundSymbol = undefined!;
    locals: BoundSymbolTable = undefined!;
    type: FunctionLikeType = undefined!;

    returnType: Types = undefined!;
    parameters: BoundDataDeclaration[] = undefined!;

    nativeSymbol?: BoundStringLiteralExpression = undefined;
}
