import { ParseContextElementArray, ParseContextKind } from '../ParserBase';
import { MissableToken, MissingToken } from '../Token/MissingToken';
import { BoolKeywordToken, FloatKeywordToken, GreaterThanSignToken, IdentifierToken, IntKeywordToken, LessThanSignToken, ObjectKeywordToken, PeriodToken, StringKeywordToken, ThrowableKeywordToken, VoidKeywordToken } from '../Token/Token';
import { ArrayTypeDeclaration } from './ArrayTypeDeclaration';
import { ModulePath } from './ModulePath';
import { Node } from './Node';
import { NodeKind } from './NodeKind';

export class TypeReference extends Node {
    static CHILD_NAMES: (keyof TypeReference)[] = [
        'modulePath',
        'scopeMemberAccessOperator',
        'name',
        'lessThanSign',
        'typeArguments',
        'greaterThanSign',
        'arrayTypeDeclarations',
    ];

    readonly kind = NodeKind.TypeReference;

    modulePath: ModulePath | null = null;
    scopeMemberAccessOperator: MissableToken<PeriodToken> | null = null;
    name: TypeReferenceIdentifierToken | MissableToken<IdentifierToken>;

    // Generic type arguments
    lessThanSign: LessThanSignToken | null = null;
    typeArguments: ParseContextElementArray<ParseContextKind.TypeReferenceSequence> | null = null;
    greaterThanSign: MissableToken<GreaterThanSignToken> | null = null;

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

export type MissableTypeReference = TypeReference | MissingToken<TypeReference['kind']>;
