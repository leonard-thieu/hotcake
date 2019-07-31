import { DataDeclarationKeywordToken } from '../../../../Syntax/Node/Declaration/DataDeclarationSequence';
import { BoundSymbol } from '../../../BoundSymbol';
import { Types } from '../../../Type/Types';
import { BoundNode } from '../../BoundNode';
import { BoundNodeKind } from '../../BoundNodeKind';
import { BoundStringLiteralExpression } from '../../Expression/BoundStringLiteralExpression';
import { BoundTypeDeclaration } from '../BoundDeclarations';

export class BoundExternDataDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ExternDataDeclaration;

    declarationKind: DataDeclarationKeywordToken['kind'] = undefined!;
    identifier: BoundSymbol = undefined!;
    typeAnnotation?: BoundTypeDeclaration = undefined;
    type: Types = undefined!;

    nativeSymbol?: BoundStringLiteralExpression = undefined;
}
