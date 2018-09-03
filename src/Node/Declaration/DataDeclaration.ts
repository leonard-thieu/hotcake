import { ColonEqualsSignToken, EachInKeywordToken, EqualsSignToken, IdentifierToken, MissingExpressionToken } from '../../Token/Token';
import { Expressions } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';
import { TypeDeclaration } from './TypeDeclaration';

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
    equalsSign: EqualsSignToken | ColonEqualsSignToken | null = null;
    eachInKeyword: EachInKeywordToken | null = null;
    expression: Expressions | MissingExpressionToken | null = null;
}
