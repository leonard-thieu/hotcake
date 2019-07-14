import { ParseContextElementDelimitedSequence, ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { ClosingParenthesisToken, ErrorableToken, OpeningParenthesisToken } from '../../Token/Token';
import { isNode } from '../Node';
import { NodeKind } from '../NodeKind';
import { Expression, Expressions } from './Expression';

export class InvokeExpression extends Expression {
    static CHILD_NAMES: (keyof InvokeExpression)[] = [
        'newlines',
        'invokableExpression',
        'openingParenthesis',
        'leadingNewlines',
        'arguments',
        'closingParenthesis',
    ];

    readonly kind = NodeKind.InvokeExpression;

    invokableExpression: Expressions = undefined!;
    openingParenthesis?: OpeningParenthesisToken = undefined;
    leadingNewlines?: ParseContextElementSequence<ParseContextKind.NewlineList> = undefined;
    arguments: ParseContextElementDelimitedSequence<ParseContextKind.ExpressionSequence> = undefined!;
    closingParenthesis?: MissableToken<ClosingParenthesisToken> = undefined;

    get firstToken(): ErrorableToken {
        if (this.newlines && this.newlines.length !== 0) {
            return this.newlines[0];
        }

        return this.invokableExpression.firstToken;
    }

    get lastToken(): ErrorableToken {
        if (this.closingParenthesis) {
            return this.closingParenthesis;
        }

        if (this.arguments.length !== 0) {
            const lastArgument = this.arguments[this.arguments.length - 1];
            if (isNode(lastArgument)) {
                return lastArgument.lastToken;
            }

            return lastArgument;
        }

        return this.invokableExpression.lastToken;
    }
}
