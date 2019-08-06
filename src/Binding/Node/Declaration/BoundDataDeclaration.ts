import { DataDeclaration, DataDeclarationKeywordToken } from '../../../Syntax/Node/Declaration/DataDeclarationSequence';
import { BoundSymbol } from '../../BoundSymbol';
import { Types } from '../../Type/Types';
import { BoundNode, BoundNodeKind } from '../BoundNodes';
import { BoundExpressions } from '../Expression/BoundExpressions';
import { BoundTypeReferenceDeclaration } from './BoundDeclarations';

export class BoundDataDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.DataDeclaration;

    // If this represents a parameter, `declarationKind` will be `null`.
    declarationKind: DataDeclarationKeywordToken['kind'] | null = undefined!;
    identifier: BoundSymbol = undefined!;
    typeAnnotation?: BoundTypeReferenceDeclaration = undefined;
    operator: NonNullable<DataDeclaration['operator']>['kind'] | null = undefined!;
    expression?: BoundExpressions = undefined;
    type: Types = undefined!;
}
