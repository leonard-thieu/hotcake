import { ParseContextElementDelimitedSequence, ParseContextKind } from '../../ParserBase';
import { BoolKeywordToken, FloatKeywordToken, GreaterThanSignToken, IntKeywordToken, LessThanSignToken, NewKeywordToken, StringKeywordToken } from '../../Token/Token';
import { EscapeOptionalIdentifierNameToken, Identifier } from '../Identifier';
import { isNode } from '../Node';
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

    get firstToken() {
        if (this.newlines && this.newlines.length !== 0) {
            return this.newlines[0];
        }

        if (isNode(this.identifier)) {
            return this.identifier.firstToken;
        }

        return this.identifier;
    }

    get lastToken() {
        if (this.greaterThanSign) {
            return this.greaterThanSign;
        }
        if (isNode(this.identifier)) {
            return this.identifier.lastToken;
        }

        return this.identifier;
    }
}

export type IdentifierExpressionIdentifier =
    Identifier |
    IdentifierExpressionToken
    ;

export type IdentifierExpressionToken =
    EscapeOptionalIdentifierNameToken |
    NewKeywordToken |   // Super.New()
    BoolKeywordToken |
    IntKeywordToken |
    FloatKeywordToken |
    StringKeywordToken
    ;
