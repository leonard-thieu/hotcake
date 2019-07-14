import { BoundSymbol, BoundSymbolTable } from '../../BoundSymbol';
import { Types } from '../../Type/Types';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundClassMethodDeclaration } from './BoundClassMethodDeclaration';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundFunctionDeclaration } from './BoundFunctionDeclaration';

export class BoundClassDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ClassDeclaration;

    identifier: BoundSymbol = undefined!;
    locals: BoundSymbolTable = undefined!;
    type: Types = undefined!;

    baseType?: Types = undefined;
    implementedTypes?: Types[] = undefined;

    members: BoundClassDeclarationMember[] = undefined!;
}

export type BoundClassDeclarationMember =
    BoundDataDeclaration |
    BoundFunctionDeclaration |
    BoundClassMethodDeclaration
    ;
