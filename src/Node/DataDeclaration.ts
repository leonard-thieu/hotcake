import { MissingToken } from '../Token/MissingToken';
import { Token } from '../Token/Token';
import { Expression } from './Expression/Expression';
import { Node } from './Node';
import { NodeKind } from './NodeKind';
import { QualifiedIdentifier } from './QualifiedIdentifier';

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
        'longhandType',
        'shorthandType',
        'equalsSign',
        'eachInKeyword',
        'expression',
    ];

    readonly kind = NodeKind.DataDeclaration;

    name: Token;

    colonEqualsSign: Token | null = null;

    colon: Token | null = null;
    longhandType: QualifiedIdentifier | null = null;

    shorthandType: Token | null = null;

    equalsSign: Token | null = null;

    eachInKeyword: Token | null = null;
    expression: Expression | MissingToken | null = null;
}
