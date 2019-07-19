import { BoolKeywordToken, FloatKeywordToken, GreaterThanSignToken, IntKeywordToken, LessThanSignToken, NewKeywordToken, StringKeywordToken } from '../../Token/Token';
import { CommaSeparator } from '../CommaSeparator';
import { EscapeOptionalIdentifierNameToken, Identifier } from '../Identifier';
import { NodeKind } from '../NodeKind';
import { TypeReference } from '../TypeReference';
import { Expression } from './Expression';

export const IdentifierExpressionChildNames: ReadonlyArray<keyof IdentifierExpression> = [
    'newlines',
    'identifier',
    'lessThanSign',
    'typeArguments',
    'greaterThanSign',
];

export class IdentifierExpression extends Expression {
    readonly kind = NodeKind.IdentifierExpression;

    identifier: IdentifierExpressionIdentifier = undefined!;

    // Generic type arguments
    lessThanSign?: LessThanSignToken = undefined;
    typeArguments?: (TypeReference | CommaSeparator)[] = undefined;
    greaterThanSign?: GreaterThanSignToken = undefined;
}

export type IdentifierExpressionIdentifier =
    | Identifier
    | IdentifierExpressionToken
    ;

export type IdentifierExpressionToken =
    | EscapeOptionalIdentifierNameToken
    | NewKeywordToken // Super.New()
    | BoolKeywordToken
    | IntKeywordToken
    | FloatKeywordToken
    | StringKeywordToken
    ;
