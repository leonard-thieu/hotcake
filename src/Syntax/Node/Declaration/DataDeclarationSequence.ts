import { MissingToken } from '../../Token/MissingToken';
import { ColonEqualsSignToken, ConstKeywordToken, EqualsSignToken, FieldKeywordToken, GlobalKeywordToken, LocalKeywordToken } from '../../Token/Tokens';
import { CommaSeparator } from '../CommaSeparator';
import { MissableExpression } from '../Expression/Expression';
import { Identifier } from '../Identifier';
import { NodeKind } from '../NodeKind';
import { TypeAnnotation } from '../TypeAnnotation';
import { Declaration } from './Declaration';

// #region Data declaration sequence

export const DataDeclarationSequenceChildNames: ReadonlyArray<keyof DataDeclarationSequence> = [
    'dataDeclarationKeyword',
    'children',
];

export class DataDeclarationSequence extends Declaration {
    readonly kind = NodeKind.DataDeclarationSequence;

    // If this represents a parameter sequence, `dataDeclarationKeyword` will be `null`.
    dataDeclarationKeyword: DataDeclarationKeywordToken | null = undefined!;
    children: (DataDeclaration | CommaSeparator)[] = undefined!;
}

export type DataDeclarationKeywordToken =
    | ConstKeywordToken
    | GlobalKeywordToken
    | FieldKeywordToken
    | LocalKeywordToken
    ;

// #endregion

// #region Data declaration

export const DataDeclarationChildNames: ReadonlyArray<keyof DataDeclaration> = [
    'identifier',
    'typeAnnotation',
    'operator',
    'expression',
];

/**
 * Default type (Int)
 *   Identifier = Expression
 *   Identifier
 *
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
 */
export class DataDeclaration extends Declaration {
    readonly kind = NodeKind.DataDeclaration;

    identifier: Identifier = undefined!;
    typeAnnotation?: TypeAnnotation = undefined;
    // Can be missable if this declaration is Const.
    // If the operator is omitted (declaration without assignment), `operator` will be `null`.
    operator: null | EqualsSignToken | ColonEqualsSignToken | MissingToken = undefined!;
    expression?: MissableExpression = undefined;
}

export type MissableDataDeclaration =
    | DataDeclaration
    | MissingToken
    ;

// #endregion
