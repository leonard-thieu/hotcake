import { BoundSymbol, BoundSymbolTable } from '../../Binder';
import { Type } from '../../Type/Type';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpressionStatement } from '../Statement/BoundExpressionStatement';
import { BoundClassDeclaration } from './BoundClassDeclaration';
import { BoundDataDeclaration } from './BoundDataDeclaration';

export class BoundClassMethodDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ClassMethodDeclaration;

    parent: BoundClassDeclaration = undefined!;

    get scope() {
        return this.parent;
    }

    identifier: BoundSymbol = undefined!;
    locals: BoundSymbolTable = undefined!;

    returnType: Type = undefined!;
    parameters: BoundDataDeclaration[] = undefined!;
    statements?: BoundExpressionStatement[] = undefined;
}
