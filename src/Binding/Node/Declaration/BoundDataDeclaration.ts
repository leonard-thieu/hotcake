import { DataDeclaration } from '../../../Syntax/Node/Declaration/DataDeclarationSequence';
import { BoundSymbol } from '../../BoundSymbol';
import { Types } from '../../Type/Types';
import { BoundNode, BoundNodeKind } from '../BoundNodes';
import { BoundExpressions } from '../Expression/BoundExpressions';
import { BoundTypeReferenceDeclaration } from './BoundDeclarations';

export class BoundDataDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.DataDeclaration;

    declarationKind: BoundDataDeclarationKind = undefined!;
    identifier: BoundSymbol = undefined!;
    typeAnnotation?: BoundTypeReferenceDeclaration = undefined;
    operator?: BoundDataDeclarationOperatorKind = undefined;
    expression?: BoundExpressions = undefined;
    type: Types = undefined!;
}

export enum BoundDataDeclarationKind {
    Const = 'Const',
    Global = 'Global',
    Field = 'Field',
    Local = 'Local',
    Parameter = 'Parameter',
}

export type BoundDataDeclarationOperatorKind = NonNullable<DataDeclaration['operator']>['kind'];
