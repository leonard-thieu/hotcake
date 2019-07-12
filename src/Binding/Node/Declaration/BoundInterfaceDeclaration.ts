import { BoundSymbol, BoundSymbolTable } from '../../Binder';
import { Type } from '../../Type/Type';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundInterfaceMethodDeclaration } from './BoundInterfaceMethodDeclaration';
import { BoundModuleDeclaration } from './BoundModuleDeclaration';

export class BoundInterfaceDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.InterfaceDeclaration;

    parent: BoundModuleDeclaration = undefined!;

    get scope() {
        return this.parent;
    }

    identifier: BoundSymbol = undefined!;
    locals: BoundSymbolTable = undefined!;

    baseTypes?: Type[] = undefined;
    members: BoundInterfaceDeclarationMember[] = undefined!;
}

export type BoundInterfaceDeclarationMember =
    BoundDataDeclaration |
    BoundInterfaceMethodDeclaration
    ;
