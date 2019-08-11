import { AmpersandToken, AndKeywordToken, AsteriskToken, EqualsSignToken, GreaterThanSignEqualsSignToken, GreaterThanSignToken, HyphenMinusToken, LessThanSignEqualsSignToken, LessThanSignGreaterThanSignToken, LessThanSignToken, ModKeywordToken, OrKeywordToken, PlusSignToken, ShlKeywordToken, ShrKeywordToken, SlashToken, TildeToken, VerticalBarToken } from '../../Token/Tokens';
import { NodeKind } from '../Nodes';
import { Expression, MissableExpression } from './Expressions';

export const BinaryExpressionChildNames: ReadonlyArray<keyof BinaryExpression> = [
    'newlines',
    'leftOperand',
    'operator',
    'rightOperand',
];

export class BinaryExpression extends Expression {
    readonly kind = NodeKind.BinaryExpression;

    leftOperand: MissableExpression = undefined!;
    operator: BinaryExpressionOperatorToken = undefined!;
    rightOperand: MissableExpression = undefined!;
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
