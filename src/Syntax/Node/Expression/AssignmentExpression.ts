import { AmpersandEqualsSignToken, AsteriskEqualsSignToken, EachInKeywordToken, EqualsSignToken, ErrorableToken, HyphenMinusEqualsSignToken, ModKeywordEqualsSignToken, PlusSignEqualsSignToken, ShlKeywordEqualsSignToken, ShrKeywordEqualsSignToken, SlashEqualsSignToken, TildeEqualsSignToken, VerticalBarEqualsSignToken } from '../../Token/Token';
import { isNode } from '../Node';
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

    leftOperand: MissableExpression = undefined!;
    operator: AssignmentOperatorToken = undefined!;
    eachInKeyword?: EachInKeywordToken = undefined;
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

export type AssignmentOperatorToken =
    | VerticalBarEqualsSignToken
    | TildeEqualsSignToken
    | AmpersandEqualsSignToken
    | HyphenMinusEqualsSignToken
    | PlusSignEqualsSignToken
    | ShrKeywordEqualsSignToken
    | ShlKeywordEqualsSignToken
    | ModKeywordEqualsSignToken
    | SlashEqualsSignToken
    | AsteriskEqualsSignToken
    | EqualsSignToken
    ;
