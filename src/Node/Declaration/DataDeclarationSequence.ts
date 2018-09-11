import { ParseContextElementDelimitedSequence, ParseContextKind } from '../../ParserBase';
import { MissableToken, MissingToken } from '../../Token/MissingToken';
import { ColonEqualsSignToken, ConstKeywordToken, EachInKeywordToken, EqualsSignToken, FieldKeywordToken, GlobalKeywordToken, LocalKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { Identifier } from '../Identifier';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';
import { TypeDeclaration } from './TypeDeclaration';

export class DataDeclarationSequence extends Declaration {
    static CHILD_NAMES: (keyof DataDeclarationSequence)[] = [
        'dataDeclarationKeyword',
        'children',
    ];

    readonly kind = NodeKind.DataDeclarationSequence;

    dataDeclarationKeyword: DataDeclarationKeywordToken = undefined!;
    children: ParseContextElementDelimitedSequence<ParseContextKind.DataDeclarationSequence> = undefined!;
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
        'identifier',
        'type',
        'equalsSign',
        'eachInKeyword',
        'expression',
    ];

    readonly kind = NodeKind.DataDeclaration;

    identifier: Identifier = undefined!;
    type?: TypeDeclaration = undefined;
    equalsSign?: MissableToken<EqualsSignToken | ColonEqualsSignToken> = undefined;
    eachInKeyword?: EachInKeywordToken = undefined;
    expression?: MissableExpression = undefined;
}

export type MissableDataDeclaration = DataDeclaration | MissingToken<DataDeclaration['kind']>;
