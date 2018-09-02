import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { BoolKeywordToken, FloatKeywordToken, GreaterThanSignToken, IdentifierToken, IntKeywordToken, LessThanSignToken, ObjectKeywordToken, PeriodToken, StringKeywordToken, ThrowableKeywordToken, Token } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class IdentifierExpression extends Expression {
    static CHILD_NAMES: (keyof IdentifierExpression)[] = [
        'newlines',
        'globalScopeMemberAccessOperator',
        'name',
        'lessThanSign',
        'typeArguments',
        'greaterThanSign',
    ];

    readonly kind = NodeKind.IdentifierExpression;

    globalScopeMemberAccessOperator: PeriodToken | null = null;
    name: IdentifierNameTokens;

    // Generic type arguments
    lessThanSign: LessThanSignToken | null = null;
    typeArguments: ParseContextElementArray<ParseContextKind.TypeReferenceSequence> | null = null;
    greaterThanSign: GreaterThanSignToken | null = null;
}

export type IdentifierNameTokens =
    BoolKeywordToken |
    IntKeywordToken |
    FloatKeywordToken |
    StringKeywordToken |
    ObjectKeywordToken |
    ThrowableKeywordToken |
    IdentifierToken
    ;
