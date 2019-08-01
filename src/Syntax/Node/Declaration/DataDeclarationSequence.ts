import { MissableToken, MissingToken } from '../../Token/MissingToken';
import { ColonEqualsSignToken, ConstKeywordToken, EqualsSignToken, FieldKeywordToken, GlobalKeywordToken, LocalKeywordToken } from '../../Token/Token';
import { CommaSeparator } from '../CommaSeparator';
import { MissableExpression } from '../Expression/Expression';
import { Identifier } from '../Identifier';
import { NodeKind } from '../NodeKind';
import { TypeAnnotation } from '../TypeAnnotation';
import { Declaration } from './Declaration';

export const DataDeclarationSequenceChildNames: ReadonlyArray<keyof DataDeclarationSequence> = [
    'dataDeclarationKeyword',
    'children',
];

export class DataDeclarationSequence extends Declaration {
    readonly kind = NodeKind.DataDeclarationSequence;

    dataDeclarationKeyword?: DataDeclarationKeywordToken = undefined;
    children: (DataDeclaration | CommaSeparator)[] = undefined!;
}

export type DataDeclarationKeywordToken =
    | ConstKeywordToken
    | GlobalKeywordToken
    | FieldKeywordToken
    | LocalKeywordToken
    ;

export const DataDeclarationChildNames: ReadonlyArray<keyof DataDeclaration> = [
    'identifier',
    'typeAnnotation',
    'equalsSign',
    'expression',
];

/**
 * Explicit type (shorthand)
 *   Identifier(?|%|#|$) = Expression
 *   Identifier(?|%|#|$)
 *
 * Explicit type (longhand)
 *   Identifier: Type = Expression
 *   Identifier: Type
 *
 * Inferred type
 *   Identifier := Expression
 *
 * Default type
 *   Identifier = Expression
 *   Identifier
 */
export class DataDeclaration extends Declaration {
    readonly kind = NodeKind.DataDeclaration;

    identifier: Identifier = undefined!;
    typeAnnotation?: TypeAnnotation = undefined;
    equalsSign?: MissableToken<EqualsSignToken | ColonEqualsSignToken> = undefined;
    expression?: MissableExpression = undefined;
}

export type MissableDataDeclaration =
    | DataDeclaration
    | MissingToken
    ;
