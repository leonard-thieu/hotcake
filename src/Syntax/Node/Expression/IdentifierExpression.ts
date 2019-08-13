import { BoolKeywordToken, FloatKeywordToken, GreaterThanSignToken, IntKeywordToken, LessThanSignToken, NewKeywordToken, StringKeywordToken } from '../../Token/Tokens';
import { CommaSeparator } from '../CommaSeparator';
import { EscapeOptionalIdentifierToken, Identifier } from '../Identifier';
import { NodeKind } from '../Nodes';
import { TypeReference } from '../TypeReference';
import { Expression } from './Expressions';

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
    lessThanSign?: LessThanSignToken = undefined!;
    typeArguments?: (TypeReference | CommaSeparator)[] = undefined!;
    greaterThanSign?: GreaterThanSignToken = undefined!;
}

export type IdentifierExpressionIdentifier =
    | Identifier
    | IdentifierExpressionToken
    ;

export type IdentifierExpressionToken =
    | EscapeOptionalIdentifierToken
    | NewKeywordToken // Super.New()
    | BoolKeywordToken
    | IntKeywordToken
    | FloatKeywordToken
    | StringKeywordToken
    ;
