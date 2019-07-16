import { BoundSymbol, BoundSymbolTable } from '../../../BoundSymbol';
import { Types } from '../../../Type/Types';
import { BoundNode } from '../../BoundNode';
import { BoundNodeKind } from '../../BoundNodeKind';
import { BoundStringLiteralExpression } from '../../Expression/BoundStringLiteralExpression';
import { BoundExternClassMethodDeclaration } from './BoundExternClassMethodDeclaration';
import { BoundExternDataDeclaration } from './BoundExternDataDeclaration';
import { BoundExternFunctionDeclaration } from './BoundExternFunctionDeclaration';

export class BoundExternClassDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ExternClassDeclaration;

    identifier: BoundSymbol = undefined!;
    locals: BoundSymbolTable = undefined!;
    type: Types = undefined!;

    baseType?: Types = undefined;

    members: BoundExternClassDeclarationMember[] = undefined!;

    nativeSymbol?: BoundStringLiteralExpression = undefined;
}

export type BoundExternClassDeclarationMember =
    BoundExternDataDeclaration |
    BoundExternFunctionDeclaration |
    BoundExternClassMethodDeclaration
    ;
