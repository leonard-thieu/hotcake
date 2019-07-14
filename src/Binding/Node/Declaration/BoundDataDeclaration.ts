import { DataDeclarationKeywordToken } from '../../../Syntax/Node/Declaration/DataDeclarationSequence';
import { BoundSymbol } from '../../BoundSymbol';
import { Types } from '../../Type/Types';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpressions } from '../Expression/BoundExpressions';

export class BoundDataDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.DataDeclaration;

    declarationKind?: DataDeclarationKeywordToken['kind'] = undefined;
    identifier: BoundSymbol = undefined!;
    type: Types = undefined!;
    expression?: BoundExpressions = undefined;
}
