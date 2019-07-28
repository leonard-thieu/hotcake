import { ExternClassDeclaration } from '../../../../Syntax/Node/Declaration/ExternDeclaration/ExternClassDeclaration';
import { BoundSymbol, BoundSymbolTable } from '../../../BoundSymbol';
import { ObjectType } from '../../../Type/ObjectType';
import { StringType } from '../../../Type/StringType';
import { BoundNode } from '../../BoundNode';
import { BoundNodeKind } from '../../BoundNodeKind';
import { BoundStringLiteralExpression } from '../../Expression/BoundStringLiteralExpression';
import { BoundExternClassMethodDeclaration } from './BoundExternClassMethodDeclaration';
import { BoundExternDataDeclaration } from './BoundExternDataDeclaration';
import { BoundExternFunctionDeclaration } from './BoundExternFunctionDeclaration';

export class BoundExternClassDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ExternClassDeclaration;

    declaration: ExternClassDeclaration = undefined!;

    identifier: BoundSymbol = undefined!;
    locals: BoundSymbolTable = undefined!;
    type: ObjectType | StringType = undefined!;

    baseType?: ObjectType = undefined;

    members: BoundExternClassDeclarationMember[] = undefined!;

    nativeSymbol?: BoundStringLiteralExpression = undefined;
}

export type BoundExternClassDeclarationMember =
    | BoundExternDataDeclaration
    | BoundExternFunctionDeclaration
    | BoundExternClassMethodDeclaration
    ;
