import { MissingToken } from '../../Token/MissingToken';
import { ColonEqualsSignToken, ConstKeywordToken, EqualsSignToken, FieldKeywordToken, GlobalKeywordToken, LocalKeywordToken } from '../../Token/Tokens';
import { CommaSeparator } from '../CommaSeparator';
import { Expressions } from '../Expression/Expressions';
import { Identifier } from '../Identifier';
import { NodeKind } from '../Nodes';
import { TypeAnnotation } from '../TypeAnnotation';
import { Declaration } from './Declarations';

// #region Data declaration sequence

export const DataDeclarationSequenceChildNames: ReadonlyArray<keyof DataDeclarationSequence> = [
    'dataDeclarationKeyword',
    'children',
];

export class DataDeclarationSequence extends Declaration {
    readonly kind = NodeKind.DataDeclarationSequence;

    // If this represents a parameter sequence, `dataDeclarationKeyword` will be `undefined`.
    dataDeclarationKeyword?: DataDeclarationKeywordToken = undefined!;
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
    typeAnnotation?: TypeAnnotation = undefined!;
    // Can be missable if this declaration is Const.
    operator?: EqualsSignToken | ColonEqualsSignToken | MissingToken = undefined!;
    expression?: Expressions | MissingToken = undefined!;
}

// #endregion
