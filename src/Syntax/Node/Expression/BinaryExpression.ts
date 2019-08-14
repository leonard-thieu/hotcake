import { MissingToken } from '../../Token/MissingToken';
import { AmpersandToken, AndKeywordToken, AsteriskToken, EqualsSignToken, GreaterThanSignEqualsSignToken, GreaterThanSignToken, HyphenMinusToken, LessThanSignEqualsSignToken, LessThanSignGreaterThanSignToken, LessThanSignToken, ModKeywordToken, OrKeywordToken, PlusSignToken, ShlKeywordToken, ShrKeywordToken, SlashToken, TildeToken, VerticalBarToken } from '../../Token/Tokens';
import { NodeKind } from '../Nodes';
import { Expression, Expressions } from './Expressions';

export const BinaryExpressionChildNames: ReadonlyArray<keyof BinaryExpression> = [
    'newlines',
    'leftOperand',
    'operator',
    'rightOperand',
];

export class BinaryExpression extends Expression {
    readonly kind = NodeKind.BinaryExpression;

    leftOperand: Expressions | MissingToken = undefined!;
    operator: BinaryExpressionOperatorToken = undefined!;
    rightOperand: Expressions | MissingToken = undefined!;
}

export type BinaryExpressionOperatorToken =
    | OrKeywordToken
    | AndKeywordToken
    | LessThanSignGreaterThanSignToken
    | GreaterThanSignEqualsSignToken
    | LessThanSignEqualsSignToken
    | GreaterThanSignToken
    | LessThanSignToken
    | EqualsSignToken
    | VerticalBarToken
    | TildeToken
    | AmpersandToken
    | HyphenMinusToken
    | PlusSignToken
    | ShrKeywordToken
    | ShlKeywordToken
    | ModKeywordToken
    | SlashToken
    | AsteriskToken
    ;
