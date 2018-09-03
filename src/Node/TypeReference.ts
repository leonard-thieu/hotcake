import { ParseContextElementArray, ParseContextKind } from '../ParserBase';
import { BoolKeywordToken, FloatKeywordToken, GreaterThanSignToken, IdentifierToken, IntKeywordToken, LessThanSignToken, ObjectKeywordToken, PeriodToken, StringKeywordToken, ThrowableKeywordToken, VoidKeywordToken } from '../Token/Token';
import { ArrayTypeDeclaration } from './ArrayTypeDeclaration';
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
    BoolKeywordToken |
    IntKeywordToken |
    FloatKeywordToken |
    StringKeywordToken |
    ObjectKeywordToken |
    ThrowableKeywordToken |
    VoidKeywordToken |
    IdentifierToken
    ;
