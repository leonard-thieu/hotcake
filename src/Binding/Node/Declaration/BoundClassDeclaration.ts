import { BoundSymbol, BoundSymbolTable } from '../../BoundSymbol';
import { Type } from '../../Type/Type';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundClassMethodDeclaration } from './BoundClassMethodDeclaration';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundFunctionDeclaration } from './BoundFunctionDeclaration';
import { BoundModuleDeclaration } from './BoundModuleDeclaration';

export class BoundClassDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ClassDeclaration;

    parent: BoundModuleDeclaration = undefined!;

    get scope() {
        return this.parent;
    }

    identifier: BoundSymbol = undefined!;
    locals: BoundSymbolTable = undefined!;
    type: Type = undefined!;

    baseType?: Type = undefined;
    implementedTypes?: Type[] = undefined;

    members: BoundClassDeclarationMember[] = undefined!;
}

export type BoundClassDeclarationMember =
    BoundDataDeclaration |
    BoundFunctionDeclaration |
    BoundClassMethodDeclaration
    ;
