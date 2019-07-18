import { HyphenMinusToken, NotKeywordToken, PlusSignToken, TildeToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, MissableExpression } from './Expression';

export class UnaryExpression extends Expression {
    readonly kind = NodeKind.UnaryExpression;

    operator: UnaryOperatorToken = undefined!;
    operand: MissableExpression = undefined!;
}

export type UnaryOperatorToken =
    | PlusSignToken
    | HyphenMinusToken
    | TildeToken
    | NotKeywordToken
    ;
