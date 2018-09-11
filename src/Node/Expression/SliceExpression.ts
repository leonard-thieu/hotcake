import { MissableToken } from '../../Token/MissingToken';
import { ClosingSquareBracketToken, OpeningSquareBracketToken, PeriodPeriodToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, Expressions } from './Expression';

export class SliceExpression extends Expression {
    static CHILD_NAMES: (keyof SliceExpression)[] = [
        'newlines',
        'sliceableExpression',
        'openingSquareBracket',
        'startExpression',
        'sliceOperator',
        'endExpression',
        'closingSquareBracket',
    ];

    readonly kind = NodeKind.SliceExpression;

    sliceableExpression: Expressions = undefined!;
    openingSquareBracket: OpeningSquareBracketToken = undefined!;
    startExpression?: Expressions = undefined;
    sliceOperator: PeriodPeriodToken = undefined!;
    endExpression?: Expressions = undefined;
    closingSquareBracket: MissableToken<ClosingSquareBracketToken> = undefined!;
}
