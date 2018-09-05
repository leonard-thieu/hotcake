import { HyphenMinusToken, MissingExpressionToken, NotKeywordToken, PlusSignToken, TildeToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, Expressions } from './Expression';

export class UnaryOpExpression extends Expression {
    static CHILD_NAMES: (keyof UnaryOpExpression)[] = [
        'newlines',
        'operator',
        'operand',
    ];

    readonly kind = NodeKind.UnaryOpExpression;

    operator: PlusSignToken | HyphenMinusToken | TildeToken | NotKeywordToken;
    operand: Expressions | MissingExpressionToken;
}
