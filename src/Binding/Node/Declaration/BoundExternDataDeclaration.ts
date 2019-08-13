import { BoundSymbol } from '../../BoundSymbol';
import { Types } from '../../Type/Types';
import { BoundNode, BoundNodeKind } from '../BoundNodes';
import { BoundStringLiteralExpression } from '../Expression/BoundStringLiteralExpression';
import { BoundTypeReferenceDeclaration } from './BoundDeclarations';

export class BoundExternDataDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ExternDataDeclaration;

    declarationKind: BoundExternDataDeclarationKind = undefined!;
    identifier: BoundSymbol = undefined!;
    typeAnnotation?: BoundTypeReferenceDeclaration = undefined!;
    type: Types = undefined!;

    nativeSymbol?: BoundStringLiteralExpression = undefined!;
}

export enum BoundExternDataDeclarationKind {
    Global = 'Global',
    Field = 'Field',
}
