import { ParseContextElementDelimitedSequence, ParseContextElementSequence, ParseContextKind } from '../ParserBase';
import { MissableToken, MissingToken } from '../Token/MissingToken';
import { BoolKeywordToken, FloatKeywordToken, GreaterThanSignToken, IdentifierToken, IntKeywordToken, LessThanSignToken, PeriodToken, StringKeywordToken, VoidKeywordToken } from '../Token/Token';
import { Identifier, IdentifierStartToken } from './Identifier';
import { isNode, Node } from './Node';
import { NodeKind } from './NodeKind';

export class TypeReference extends Node {
    static CHILD_NAMES: (keyof TypeReference)[] = [
        'moduleIdentifier',
        'scopeMemberAccessOperator',
        'identifier',
        'lessThanSign',
        'typeArguments',
        'greaterThanSign',
        'arrayTypeAnnotations',
    ];

    readonly kind = NodeKind.TypeReference;

    moduleIdentifier?: IdentifierToken = undefined;
    scopeMemberAccessOperator?: MissableToken<PeriodToken> = undefined;
    identifier: TypeReferenceIdentifier | MissableToken<IdentifierToken> = undefined!;

    // Generic type arguments
    lessThanSign?: LessThanSignToken = undefined;
    typeArguments?: ParseContextElementDelimitedSequence<ParseContextKind.TypeReferenceSequence> = undefined;
    greaterThanSign?: MissableToken<GreaterThanSignToken> = undefined;

    arrayTypeAnnotations: ParseContextElementSequence<ParseContextKind.ArrayTypeAnnotationList> = undefined!;

    get firstToken() {
        if (this.moduleIdentifier) {
            return this.moduleIdentifier;
        }

        if (isNode(this.identifier)) {
            return this.identifier.firstToken;
        }

        return this.identifier;
    }

    get lastToken() {
        if (this.arrayTypeAnnotations.length !== 0) {
            return this.arrayTypeAnnotations[this.arrayTypeAnnotations.length - 1].lastToken;
        }

        if (this.greaterThanSign) {
            return this.greaterThanSign;
        }

        if (isNode(this.identifier)) {
            return this.identifier.lastToken;
        }

        return this.identifier;
    }
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
