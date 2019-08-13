import { BoundSymbol } from '../../BoundSymbol';
import { BoundNode, BoundNodeKind } from '../BoundNodes';
import { BoundClassDeclaration } from './BoundClassDeclaration';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundClassMethodGroupDeclaration, BoundExternClassMethodGroupDeclaration, BoundExternFunctionGroupDeclaration, BoundFunctionGroupDeclaration, BoundInterfaceMethodGroupDeclaration } from './BoundFunctionLikeGroupDeclaration';
import { BoundInterfaceDeclaration } from './BoundInterfaceDeclaration';
import { BoundIntrinsicTypeDeclaration } from './BoundIntrinsicTypeDeclaration';
import { BoundModuleDeclaration } from './BoundModuleDeclaration';
import { BoundExternClassDeclaration } from './Extern/BoundExternClassDeclaration';
import { BoundExternDataDeclaration } from './Extern/BoundExternDataDeclaration';

export class BoundAliasDirective extends BoundNode {
    readonly kind = BoundNodeKind.AliasDirective;

    identifier: BoundSymbol = undefined!;
    type: BoundAliasDirectiveTarget['type'] = undefined!;
    target: BoundAliasDirectiveTarget = undefined!;
}

export type BoundAliasDirectiveTarget =
    | BoundModuleDeclaration
    | BoundExternClassDeclaration
    | BoundInterfaceDeclaration
    | BoundClassDeclaration
    | BoundExternFunctionGroupDeclaration
    | BoundFunctionGroupDeclaration
    | BoundExternClassMethodGroupDeclaration
    | BoundInterfaceMethodGroupDeclaration
    | BoundClassMethodGroupDeclaration
    | BoundExternDataDeclaration
    | BoundDataDeclaration
    | BoundIntrinsicTypeDeclaration
    ;
