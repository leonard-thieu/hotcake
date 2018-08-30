import { MissingToken } from '../Token/MissingToken';
import { Token } from '../Token/Token';
import { Expression } from './Expression/Expression';
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

    name: Token;

    colonEqualsSign: Token | null = null;

    colon: Token | null = null;
    type: TypeReference | null = null;;

    equalsSign: Token | null = null;

    eachInKeyword: Token | null = null;
    expression: Expression | MissingToken | null = null;
}
