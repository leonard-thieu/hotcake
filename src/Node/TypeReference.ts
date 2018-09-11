import { ParseContextElementDelimitedSequence, ParseContextElementSequence, ParseContextKind } from '../ParserBase';
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

    modulePath?: ModulePath = undefined;
    scopeMemberAccessOperator?: MissableToken<PeriodToken> = undefined;
    identifier: TypeReferenceIdentifier | MissableToken<IdentifierToken> = undefined!;

    // Generic type arguments
    lessThanSign?: LessThanSignToken = undefined;
    typeArguments?: ParseContextElementDelimitedSequence<ParseContextKind.TypeReferenceSequence> = undefined;
    greaterThanSign?: MissableToken<GreaterThanSignToken> = undefined;

    arrayTypeDeclarations: ParseContextElementSequence<ParseContextKind.ArrayTypeDeclarationList> = undefined!;
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
