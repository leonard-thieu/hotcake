import { ExternClassDeclaration } from '../../../../Syntax/Node/Declaration/ExternDeclaration/ExternClassDeclaration';
import { BoundSymbol, BoundSymbolTable } from '../../../BoundSymbol';
import { ArrayType } from '../../../Type/ArrayType';
import { ObjectType } from '../../../Type/ObjectType';
import { StringType } from '../../../Type/StringType';
import { BoundNode } from '../../BoundNode';
import { BoundNodeKind } from '../../BoundNodeKind';
import { BoundStringLiteralExpression } from '../../Expression/BoundStringLiteralExpression';
import { BoundClassDeclaration } from '../BoundClassDeclaration';
import { BoundExternClassMethodGroupDeclaration, BoundExternFunctionGroupDeclaration } from '../BoundFunctionLikeGroupDeclaration';
import { BoundTypeMembers } from '../BoundTypeMembers';
import { BoundExternDataDeclaration } from './BoundExternDataDeclaration';

export class BoundExternClassDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ExternClassDeclaration;

    declaration: ExternClassDeclaration = undefined!;

    identifier: BoundSymbol = undefined!;
    readonly locals = new BoundSymbolTable();
    type: ObjectType | StringType | ArrayType = undefined!;

    superType?: BoundExternClassDeclaration | BoundClassDeclaration = undefined;
    nativeSymbol?: BoundStringLiteralExpression = undefined;

    readonly members = new BoundTypeMembers<BoundExternClassDeclarationMember>();
}

export type BoundExternClassDeclarationMember =
    | BoundExternDataDeclaration
    | BoundExternFunctionGroupDeclaration
    | BoundExternClassMethodGroupDeclaration
    ;
