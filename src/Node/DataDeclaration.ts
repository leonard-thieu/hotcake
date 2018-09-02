import { ColonEqualsSignToken, ColonToken, EachInKeywordToken, EqualsSignToken, IdentifierToken, MissingExpressionToken } from '../Token/Token';
import { Expressions } from './Expression/Expression';
import { Node } from './Node';
import { NodeKind } from './NodeKind';
import { TypeReference } from './TypeReference';

/**
 * Inferred type
 *   Identifier := Expression
 * 
 * Explicit type (longhand)
 *   Identifier: Type = Expression
 *   Identifier: Type
 * 
 * Explicit type (shorthand)
 *   Identifier($|?|#|%) = Expression
 *   Identifier($|?|#|%)
 * 
 * Default type
 *   Identifier = Expression
 *   Identifier
 */
export class DataDeclaration extends Node {
    static CHILD_NAMES: (keyof DataDeclaration)[] = [
        'name',
        'colonEqualsSign',
        'colon',
        'type',
        'equalsSign',
        'eachInKeyword',
        'expression',
    ];

    readonly kind = NodeKind.DataDeclaration;

    name: IdentifierToken;

    colonEqualsSign: ColonEqualsSignToken | null = null;

    colon: ColonToken | null = null;
    type: TypeReference | null = null;

    equalsSign: EqualsSignToken | null = null;

    eachInKeyword: EachInKeywordToken | null = null;
    expression: Expressions | MissingExpressionToken | null = null;
}
