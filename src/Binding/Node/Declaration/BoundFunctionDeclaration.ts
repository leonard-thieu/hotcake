import { BoundSymbol, BoundSymbolTable } from '../../Binder';
import { Type } from '../../Type/Type';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpressionStatement } from '../Statement/BoundExpressionStatement';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundModuleDeclaration } from './BoundModuleDeclaration';

export class BoundFunctionDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.FunctionDeclaration;

    parent: BoundModuleDeclaration = undefined!;

    get scope() {
        return this.parent;
    }

    identifier: BoundSymbol = undefined!;
    locals: BoundSymbolTable = undefined!;

    returnType: Type = undefined!;
    parameters: BoundDataDeclaration[] = undefined!;
    statements?: BoundExpressionStatement[] = undefined;
}
