import { ParseContextElementArray, ParseContextKind } from '../ParserBase';
import { MissableToken, MissingToken } from '../Token/MissingToken';
import { BoolKeywordToken, FloatKeywordToken, GreaterThanSignToken, IdentifierToken, IntKeywordToken, LessThanSignToken, PeriodToken, StringKeywordToken, VoidKeywordToken } from '../Token/Token';
import { Identifier, IdentifierStartToken } from './Identifier';
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
    scopeMemberAccessOperator: MissableToken<PeriodToken> | null = null;
    identifier: TypeReferenceIdentifier | MissableToken<IdentifierToken>;

    // Generic type arguments
    lessThanSign: LessThanSignToken | null = null;
    typeArguments: ParseContextElementArray<ParseContextKind.TypeReferenceSequence> | null = null;
    greaterThanSign: MissableToken<GreaterThanSignToken> | null = null;

    arrayTypeDeclarations: ParseContextElementArray<ParseContextKind.ArrayTypeDeclarationList>;
}

export type TypeReferenceIdentifier =
    Identifier |
    BoolKeywordToken |
    IntKeywordToken |
    FloatKeywordToken |
    StringKeywordToken |
    VoidKeywordToken
    ;

export type TypeReferenceIdentifierStartToken =
    IdentifierStartToken |
    BoolKeywordToken |
    IntKeywordToken |
    FloatKeywordToken |
    StringKeywordToken |
    VoidKeywordToken
    ;

export type MissableTypeReference = TypeReference | MissingToken<TypeReference['kind']>;
