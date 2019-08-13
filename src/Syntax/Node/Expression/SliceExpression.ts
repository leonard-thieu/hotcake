import { MissingToken } from '../../Token/MissingToken';
import { ClosingSquareBracketToken, OpeningSquareBracketToken, PeriodPeriodToken } from '../../Token/Tokens';
import { NodeKind } from '../Nodes';
import { Expression, Expressions } from './Expressions';

export const SliceExpressionChildNames: ReadonlyArray<keyof SliceExpression> = [
    'newlines',
    'sliceableExpression',
    'openingSquareBracket',
    'startExpression',
    'sliceOperator',
    'endExpression',
    'closingSquareBracket',
];

export class SliceExpression extends Expression {
    readonly kind = NodeKind.SliceExpression;

    sliceableExpression: Expressions = undefined!;
    openingSquareBracket: OpeningSquareBracketToken = undefined!;
    startExpression?: Expressions = undefined!;
    sliceOperator: PeriodPeriodToken = undefined!;
    endExpression?: Expressions = undefined!;
    closingSquareBracket: ClosingSquareBracketToken | MissingToken = undefined!;
}
