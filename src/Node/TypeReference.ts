import { ParseContextElementArray, ParseContextKind } from '../ParserBase';
import { BoolKeywordToken, ClosingSquareBracketToken, DollarSignToken, FloatKeywordToken, GreaterThanSignToken, IntKeywordToken, LessThanSignToken, MissingExpressionToken, NumberSignToken, ObjectKeywordToken, OpeningSquareBracketToken, PercentSignToken, PeriodToken, QuestionMarkToken, StringKeywordToken, ThrowableKeywordToken, VoidKeywordToken, IdentifierToken } from '../Token/Token';
import { Expressions } from './Expression/Expression';
import { ModulePath } from './ModulePath';
import { Node } from './Node';
import { NodeKind } from './NodeKind';

export class TypeReference extends Node {
    static CHILD_NAMES: (keyof TypeReference)[] = [
        'modulePath',
        'scopeMemberAccessOperator',
        'identifier',
        'lessThanSign',
        'typeArguments',
        'greaterThanSign',
        'arrayTypeDeclarations',
    ];

    readonly kind = NodeKind.TypeReference;

    modulePath: ModulePath | null = null;
    scopeMemberAccessOperator: PeriodToken | null = null;
    identifier: TypeReferenceIdentifierToken;

    // Generic type arguments
    lessThanSign: LessThanSignToken | null = null;
    typeArguments: ParseContextElementArray<ParseContextKind.TypeReferenceSequence> | null = null;
    greaterThanSign: GreaterThanSignToken | null = null;

    arrayTypeDeclarations: ArrayTypeDeclaration[] | null = null;
}

export type TypeReferenceIdentifierToken =
    QuestionMarkToken |
    PercentSignToken |
    NumberSignToken |
    DollarSignToken |
    BoolKeywordToken |
    IntKeywordToken |
    FloatKeywordToken |
    StringKeywordToken |
    ObjectKeywordToken |
    ThrowableKeywordToken |
    VoidKeywordToken |
    IdentifierToken
    ;

export class ArrayTypeDeclaration extends Node {
    static CHILD_NAMES: (keyof ArrayTypeDeclaration)[] = [
        'openingSquareBracket',
        'expression',
        'closingSquareBracket',
    ];

    readonly kind = NodeKind.ArrayTypeDeclaration;

    openingSquareBracket: OpeningSquareBracketToken;
    expression: Expressions | MissingExpressionToken | null = null;
    closingSquareBracket: ClosingSquareBracketToken;
}
