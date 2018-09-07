import { MissableToken } from '../../Token/MissingToken';
import { ClosingSquareBracketToken, OpeningSquareBracketToken, PeriodPeriodToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, Expressions, MissableExpression } from './Expression';

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

    sliceableExpression: Expressions;
    openingSquareBracket: OpeningSquareBracketToken;
    startExpression: MissableExpression | null = null;
    sliceOperator: MissableToken<PeriodPeriodToken>;
    endExpression: MissableExpression | null = null;
    closingSquareBracket: MissableToken<ClosingSquareBracketToken>;
}
