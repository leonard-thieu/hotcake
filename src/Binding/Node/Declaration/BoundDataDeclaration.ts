import { DataDeclarationKeywordToken } from '../../../Syntax/Node/Declaration/DataDeclarationSequence';
import { BoundSymbol } from '../../BoundSymbol';
import { Types } from '../../Type/Types';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpressions } from '../Expression/BoundExpressions';
import { BoundTypeReferenceDeclaration } from './BoundDeclarations';

export class BoundDataDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.DataDeclaration;

    declarationKind?: DataDeclarationKeywordToken['kind'] = undefined;
    identifier: BoundSymbol = undefined!;
    typeAnnotation?: BoundTypeReferenceDeclaration = undefined;
    expression?: BoundExpressions = undefined;
    type: Types = undefined!;
}
