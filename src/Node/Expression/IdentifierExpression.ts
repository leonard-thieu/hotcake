import { ParseContextElementDelimitedSequence, ParseContextKind } from '../../ParserBase';
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

    identifier: IdentifierExpressionIdentifier = undefined!;

    // Generic type arguments
    lessThanSign?: LessThanSignToken = undefined;
    typeArguments?: ParseContextElementDelimitedSequence<ParseContextKind.TypeReferenceSequence> = undefined;
    greaterThanSign?: GreaterThanSignToken = undefined;
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
