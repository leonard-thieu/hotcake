import { AmpersandToken, AndKeywordToken, AsteriskToken, EqualsSignToken, ErrorableToken, GreaterThanSignEqualsSignToken, GreaterThanSignToken, HyphenMinusToken, LessThanSignEqualsSignToken, LessThanSignGreaterThanSignToken, LessThanSignToken, ModKeywordToken, OrKeywordToken, PlusSignToken, ShlKeywordToken, ShrKeywordToken, SlashToken, TildeToken, VerticalBarToken } from '../../Token/Token';
import { isNode } from '../Node';
import { NodeKind } from '../NodeKind';
import { Expression, MissableExpression } from './Expression';

export class BinaryExpression extends Expression {
    static CHILD_NAMES: (keyof BinaryExpression)[] = [
        'newlines',
        'leftOperand',
        'operator',
        'rightOperand',
    ];

    readonly kind = NodeKind.BinaryExpression;

    leftOperand: MissableExpression = undefined!;
    operator: BinaryExpressionOperatorToken = undefined!;
    rightOperand: MissableExpression = undefined!;

    get firstToken(): ErrorableToken {
        if (this.newlines && this.newlines.length !== 0) {
            return this.newlines[0];
        }

        if (isNode(this.leftOperand)) {
            return this.leftOperand.firstToken;
        }

        return this.leftOperand;
    }

    get lastToken(): ErrorableToken {
        if (isNode(this.rightOperand)) {
            return this.rightOperand.lastToken;
        }

        return this.rightOperand;
    }
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
