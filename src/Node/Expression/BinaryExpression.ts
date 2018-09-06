import { AmpersandToken, AndKeywordToken, AsteriskToken, EqualsSignToken, GreaterThanSignEqualsSignToken, GreaterThanSignToken, HyphenMinusToken, LessThanSignEqualsSignToken, LessThanSignGreaterThanSignToken, LessThanSignToken, MissingExpressionToken, ModKeywordToken, OrKeywordToken, PlusSignToken, ShlKeywordToken, ShrKeywordToken, SlashToken, TildeToken, VerticalBarToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, Expressions } from './Expression';

export class BinaryExpression extends Expression {
    static CHILD_NAMES: (keyof BinaryExpression)[] = [
        'newlines',
        'leftOperand',
        'operator',
        'rightOperand',
    ];

    readonly kind = NodeKind.BinaryExpression;

    leftOperand: Expressions | MissingExpressionToken;
    operator: BinaryExpressionOperatorToken;
    rightOperand: Expressions | MissingExpressionToken;
}

export type BinaryExpressionOperatorToken =
    OrKeywordToken |
    AndKeywordToken |
    LessThanSignGreaterThanSignToken |
    GreaterThanSignEqualsSignToken |
    LessThanSignEqualsSignToken |
    GreaterThanSignToken |
    LessThanSignToken |
    EqualsSignToken |
    VerticalBarToken |
    TildeToken |
    AmpersandToken |
    HyphenMinusToken |
    PlusSignToken |
    ShrKeywordToken |
    ShlKeywordToken |
    ModKeywordToken |
    SlashToken |
    AsteriskToken
    ;
