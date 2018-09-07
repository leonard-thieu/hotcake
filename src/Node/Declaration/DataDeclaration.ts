import { MissingToken } from '../../Token/MissingToken';
import { ColonEqualsSignToken, EachInKeywordToken, EqualsSignToken, IdentifierToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
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
    expression: MissableExpression | null = null;
}

export type MissableDataDeclaration = DataDeclaration | MissingToken<DataDeclaration['kind']>;
