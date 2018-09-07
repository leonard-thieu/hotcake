import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { ClosingParenthesisToken, OpeningParenthesisToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, Expressions } from './Expression';

export class InvokeExpression extends Expression {
    static CHILD_NAMES: (keyof InvokeExpression)[] = [
        'newlines',
        'invokableExpression',
        'openingParenthesis',
        'arguments',
        'closingParenthesis',
    ];

    readonly kind = NodeKind.InvokeExpression;

    invokableExpression: Expressions;
    openingParenthesis: OpeningParenthesisToken | null = null;
    arguments: ParseContextElementArray<ParseContextKind.ExpressionSequence>;
    closingParenthesis: MissableToken<ClosingParenthesisToken> | null = null;
}
