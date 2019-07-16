import { DataDeclarationKeywordToken } from '../../../../Syntax/Node/Declaration/DataDeclarationSequence';
import { BoundSymbol } from '../../../BoundSymbol';
import { Types } from '../../../Type/Types';
import { BoundNode } from '../../BoundNode';
import { BoundNodeKind } from '../../BoundNodeKind';
import { BoundStringLiteralExpression } from '../../Expression/BoundStringLiteralExpression';

export class BoundExternDataDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.ExternDataDeclaration;

    declarationKind: DataDeclarationKeywordToken['kind'] = undefined!;
    identifier: BoundSymbol = undefined!;
    type: Types = undefined!;

    nativeSymbol?: BoundStringLiteralExpression = undefined;
}
