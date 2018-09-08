import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { MissableToken, MissingToken } from '../../Token/MissingToken';
import { ColonEqualsSignToken, ConstKeywordToken, EachInKeywordToken, EqualsSignToken, FieldKeywordToken, GlobalKeywordToken, IdentifierToken, LocalKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';
import { TypeDeclaration } from './TypeDeclaration';

export class DataDeclarationSequence extends Declaration {
    static CHILD_NAMES: (keyof DataDeclarationSequence)[] = [
        'dataDeclarationKeyword',
        'children',
    ];

    readonly kind = NodeKind.DataDeclarationSequence;

    dataDeclarationKeyword: DataDeclarationKeywordToken;
    children: ParseContextElementArray<ParseContextKind.DataDeclarationSequence>;
}

export type DataDeclarationKeywordToken =
    ConstKeywordToken |
    GlobalKeywordToken |
    FieldKeywordToken |
    LocalKeywordToken
    ;

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
    static CHILD_NAMES: (keyof DataDeclaration)[] = [
        'name',
        'type',
        'equalsSign',
        'eachInKeyword',
        'expression',
    ];

    readonly kind = NodeKind.DataDeclaration;

    name: IdentifierToken;
    type: TypeDeclaration | null = null;
    equalsSign: MissableToken<EqualsSignToken | ColonEqualsSignToken> | null = null;
    eachInKeyword: EachInKeywordToken | null = null;
    expression: MissableExpression | null = null;
}

export type MissableDataDeclaration = DataDeclaration | MissingToken<DataDeclaration['kind']>;
