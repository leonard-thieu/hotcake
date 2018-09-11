import { HyphenMinusToken, NotKeywordToken, PlusSignToken, TildeToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, MissableExpression } from './Expression';

export class UnaryOpExpression extends Expression {
    static CHILD_NAMES: (keyof UnaryOpExpression)[] = [
        'newlines',
        'operator',
        'operand',
    ];

    readonly kind = NodeKind.UnaryOpExpression;

    operator: UnaryOperatorToken = undefined!;
    operand: MissableExpression = undefined!;
}

export type UnaryOperatorToken =
    PlusSignToken |
    HyphenMinusToken |
    TildeToken |
    NotKeywordToken
    ;
