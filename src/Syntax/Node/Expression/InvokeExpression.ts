import { MissingToken } from '../../Token/MissingToken';
import { ClosingParenthesisToken, NewlineToken, OpeningParenthesisToken } from '../../Token/Tokens';
import { CommaSeparator } from '../CommaSeparator';
import { NodeKind } from '../Nodes';
import { Expression, Expressions } from './Expressions';

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
    openingParenthesis?: OpeningParenthesisToken = undefined!;
    leadingNewlines?: NewlineToken[] = undefined!;
    arguments: (Expressions | MissingToken | CommaSeparator)[] = undefined!;
    closingParenthesis?: ClosingParenthesisToken | MissingToken = undefined!;
}
