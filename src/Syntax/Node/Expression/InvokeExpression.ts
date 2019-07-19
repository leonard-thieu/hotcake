import { MissableToken } from '../../Token/MissingToken';
import { ClosingParenthesisToken, NewlineToken, OpeningParenthesisToken } from '../../Token/Token';
import { CommaSeparator } from '../CommaSeparator';
import { NodeKind } from '../NodeKind';
import { Expression, Expressions, MissableExpression } from './Expression';

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
    leadingNewlines?: NewlineToken[] = undefined;
    arguments: (MissableExpression | CommaSeparator)[] = undefined!;
    closingParenthesis?: MissableToken<ClosingParenthesisToken> = undefined;
}
