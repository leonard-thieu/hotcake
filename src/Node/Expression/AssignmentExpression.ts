import { AmpersandEqualsSignToken, AsteriskEqualsSignToken, EachInKeywordToken, EqualsSignToken, HyphenMinusEqualsSignToken, ModKeywordEqualsSignToken, PlusSignEqualsSignToken, ShlKeywordEqualsSignToken, ShrKeywordEqualsSignToken, SlashEqualsSignToken, TildeEqualsSignToken, VerticalBarEqualsSignToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, MissableExpression } from './Expression';

export class AssignmentExpression extends Expression {
    static CHILD_NAMES: (keyof AssignmentExpression)[] = [
        'newlines',
        'leftOperand',
        'operator',
        'eachInKeyword',
        'rightOperand',
    ];

    readonly kind = NodeKind.AssignmentExpression;

    leftOperand: MissableExpression;
    operator: AssignmentOperatorToken;
    eachInKeyword: EachInKeywordToken | null = null;
    rightOperand: MissableExpression;
}

export type AssignmentOperatorToken =
    VerticalBarEqualsSignToken |
    TildeEqualsSignToken |
    AmpersandEqualsSignToken |
    HyphenMinusEqualsSignToken |
    PlusSignEqualsSignToken |
    ShrKeywordEqualsSignToken |
    ShlKeywordEqualsSignToken |
    ModKeywordEqualsSignToken |
    SlashEqualsSignToken |
    AsteriskEqualsSignToken |
    EqualsSignToken
    ;
