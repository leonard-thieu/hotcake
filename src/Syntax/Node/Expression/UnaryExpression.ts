import { MissingToken } from '../../Token/MissingToken';
import { HyphenMinusToken, NotKeywordToken, PlusSignToken, TildeToken } from '../../Token/Tokens';
import { NodeKind } from '../Nodes';
import { Expression, Expressions } from './Expressions';

export const UnaryExpressionChildNames: ReadonlyArray<keyof UnaryExpression> = [
    'newlines',
    'operator',
    'operand',
];

export class UnaryExpression extends Expression {
    readonly kind = NodeKind.UnaryExpression;

    operator: UnaryOperatorToken = undefined!;
    operand: Expressions | MissingToken = undefined!;
}

export type UnaryOperatorToken =
    | PlusSignToken
    | HyphenMinusToken
    | TildeToken
    | NotKeywordToken
    ;
