import { BoundSymbol, BoundSymbolTable } from '../../BoundSymbol';
import { Type } from '../../Type/Type';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpressionStatement } from '../Statement/BoundExpressionStatement';
import { BoundClassDeclaration } from './BoundClassDeclaration';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundModuleDeclaration } from './BoundModuleDeclaration';

export class BoundFunctionDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.FunctionDeclaration;

    parent: BoundFunctionDeclarationParent = undefined!;

    get scope() {
        return this.parent;
    }

    identifier: BoundSymbol = undefined!;
    locals: BoundSymbolTable = undefined!;

    returnType: Type = undefined!;
    parameters: BoundDataDeclaration[] = undefined!;
    statements?: BoundExpressionStatement[] = undefined;
}

export type BoundFunctionDeclarationParent =
    BoundModuleDeclaration |
    BoundClassDeclaration
    ;
