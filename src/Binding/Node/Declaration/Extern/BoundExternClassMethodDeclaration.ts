import { BoundSymbol, BoundSymbolTable } from '../../../BoundSymbol';
import { Types } from '../../../Type/Types';
import { BoundNode } from '../../BoundNode';
import { BoundNodeKind } from '../../BoundNodeKind';
import { BoundStringLiteralExpression } from '../../Expression/BoundStringLiteralExpression';
import { BoundDataDeclaration } from '../BoundDataDeclaration';

export class BoundExternClassMethodDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ExternClassMethodDeclaration;

    identifier: BoundSymbol = undefined!;
    locals: BoundSymbolTable = undefined!;

    returnType: Types = undefined!;
    parameters: BoundDataDeclaration[] = undefined!;

    nativeSymbol?: BoundStringLiteralExpression = undefined;
}