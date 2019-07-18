import { ParseContextElementDelimitedSequence, ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { ClosingParenthesisToken, OpeningParenthesisToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, Expressions } from './Expression';

export const InvokeExpressionChildNames: ReadonlyArray<keyof InvokeExpression> = [
    'newlines',
    'invokableExpression',
    'openingParenthesis',
    'leadingNewlines',
    'arguments',
    'closingParenthesis',
];

export class InvokeExpression extends Expression {
    readonly kind = NodeKind.InvokeExpression;

    invokableExpression: Expressions = undefined!;
    openingParenthesis?: OpeningParenthesisToken = undefined;
    leadingNewlines?: ParseContextElementSequence<ParseContextKind.NewlineList> = undefined;
    arguments: ParseContextElementDelimitedSequence<ParseContextKind.ExpressionSequence> = undefined!;
    closingParenthesis?: MissableToken<ClosingParenthesisToken> = undefined;
}
