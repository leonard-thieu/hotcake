import { MissingToken } from '../../Token/MissingToken';
import { HyphenMinusToken, NotKeywordToken, PlusSignToken, TildeToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, Expressions } from './Expression';

export class UnaryOpExpression extends Expression {
    static CHILD_NAMES: (keyof UnaryOpExpression)[] = [
        'newlines',
        'operator',
        'operand',
    ];

    readonly kind = NodeKind.UnaryOpExpression;

    operator: UnaryOpTokens;
    operand: Expressions | MissingToken;
}

export type UnaryOpTokens =
    PlusSignToken |
    HyphenMinusToken |
    TildeToken |
    NotKeywordToken
    ;
