import { ParseContextElementDelimitedSequence, ParseContextElementSequence, ParseContextKind } from '../ParserBase';
import { MissableToken, MissingToken } from '../Token/MissingToken';
import { BoolKeywordToken, FloatKeywordToken, GreaterThanSignToken, IdentifierToken, IntKeywordToken, LessThanSignToken, PeriodToken, StringKeywordToken, VoidKeywordToken } from '../Token/Token';
import { Identifier, IdentifierStartToken } from './Identifier';
import { Node } from './Node';
import { NodeKind } from './NodeKind';

export const TypeReferenceChildNames: ReadonlyArray<keyof TypeReference> = [
    'moduleIdentifier',
    'scopeMemberAccessOperator',
    'identifier',
    'lessThanSign',
    'typeArguments',
    'greaterThanSign',
    'arrayTypeAnnotations',
];

export class TypeReference extends Node {
    readonly kind = NodeKind.TypeReference;

    moduleIdentifier?: IdentifierToken = undefined;
    scopeMemberAccessOperator?: MissableToken<PeriodToken> = undefined;
    identifier: TypeReferenceIdentifier | MissableToken<IdentifierToken> = undefined!;

    // Generic type arguments
    lessThanSign?: LessThanSignToken = undefined;
    typeArguments?: ParseContextElementDelimitedSequence<ParseContextKind.TypeReferenceSequence> = undefined;
    greaterThanSign?: MissableToken<GreaterThanSignToken> = undefined;

    arrayTypeAnnotations: ParseContextElementSequence<ParseContextKind.ArrayTypeAnnotationList> = undefined!;
}

export type TypeReferenceIdentifier =
    | Identifier
    | BoolKeywordToken
    | IntKeywordToken
    | FloatKeywordToken
    | StringKeywordToken
    | VoidKeywordToken
    ;

export type TypeReferenceIdentifierStartToken =
    | IdentifierStartToken
    | BoolKeywordToken
    | IntKeywordToken
    | FloatKeywordToken
    | StringKeywordToken
    | VoidKeywordToken
    ;

export type MissableTypeReference =
    | TypeReference
    | MissingToken
    ;
