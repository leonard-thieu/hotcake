import { MissingToken } from '../Token/MissingToken';
import { BoolKeywordToken, FloatKeywordToken, GreaterThanSignToken, IdentifierToken, IntKeywordToken, LessThanSignToken, PeriodToken, StringKeywordToken, VoidKeywordToken } from '../Token/Tokens';
import { ArrayTypeAnnotation } from './ArrayTypeAnnotation';
import { CommaSeparator } from './CommaSeparator';
import { Identifier, IdentifierStartToken } from './Identifier';
import { Node, NodeKind } from './Nodes';

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
    scopeMemberAccessOperator?: PeriodToken | MissingToken = undefined;
    identifier: TypeReferenceIdentifier | IdentifierToken | MissingToken = undefined!;

    // Generic type arguments
    lessThanSign?: LessThanSignToken = undefined;
    typeArguments?: (TypeReference | CommaSeparator)[] = undefined;
    greaterThanSign?: GreaterThanSignToken | MissingToken = undefined;

    arrayTypeAnnotations: ArrayTypeAnnotation[] = undefined!;
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
