import { BoundSymbol, BoundSymbolTable } from '../../Binder';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundFunctionDeclaration } from './BoundFunctionDeclaration';

export class BoundModuleDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ModuleDeclaration;

    identifier: BoundSymbol = undefined!;
    locals: BoundSymbolTable = undefined!;

    members: BoundFunctionDeclaration[] = undefined!;
}
