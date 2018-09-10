import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { BoolKeywordToken, FloatKeywordToken, GreaterThanSignToken, IntKeywordToken, LessThanSignToken, NewKeywordToken, StringKeywordToken } from '../../Token/Token';
import { EscapeOptionalIdentifierNameToken, Identifier } from '../Identifier';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class IdentifierExpression extends Expression {
    static CHILD_NAMES: (keyof IdentifierExpression)[] = [
        'newlines',
        'identifier',
        'lessThanSign',
        'typeArguments',
        'greaterThanSign',
    ];

    readonly kind = NodeKind.IdentifierExpression;

    identifier: IdentifierExpressionIdentifier;

    // Generic type arguments
    lessThanSign: LessThanSignToken | null = null;
    typeArguments: ParseContextElementArray<ParseContextKind.TypeReferenceSequence> | null = null;
    greaterThanSign: GreaterThanSignToken | null = null;
}

export type IdentifierExpressionIdentifier =
    Identifier |
    IdentifierExpressionToken
    ;

export type IdentifierExpressionToken =
    EscapeOptionalIdentifierNameToken |
    NewKeywordToken |
    BoolKeywordToken |
    IntKeywordToken |
    FloatKeywordToken |
    StringKeywordToken
    ;
