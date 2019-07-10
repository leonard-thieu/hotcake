import { ErrorableToken, HyphenMinusToken, NotKeywordToken, PlusSignToken, TildeToken } from '../../Token/Token';
import { isNode } from '../Node';
import { NodeKind } from '../NodeKind';
import { Expression, MissableExpression } from './Expression';

export class UnaryExpression extends Expression {
    static CHILD_NAMES: (keyof UnaryExpression)[] = [
        'newlines',
        'operator',
        'operand',
    ];

    readonly kind = NodeKind.UnaryExpression;

    operator: UnaryOperatorToken = undefined!;
    operand: MissableExpression = undefined!;

    get firstToken() {
        if (this.newlines && this.newlines.length !== 0) {
            return this.newlines[0];
        }

        return this.operator;
    }

    get lastToken(): ErrorableToken {
        if (isNode(this.operand)) {
            return this.operand.lastToken;
        }

        return this.operand;
    }
}

export type UnaryOperatorToken =
    PlusSignToken |
    HyphenMinusToken |
    TildeToken |
    NotKeywordToken
    ;
