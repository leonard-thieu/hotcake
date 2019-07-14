import { MissableToken } from '../../Token/MissingToken';
import { ClosingSquareBracketToken, ErrorableToken, OpeningSquareBracketToken, PeriodPeriodToken } from '../../Token/Token';
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

    get firstToken(): ErrorableToken {
        if (this.newlines && this.newlines.length !== 0) {
            return this.newlines[0];
        }

        return this.sliceableExpression.firstToken;
    }

    get lastToken() {
        return this.closingSquareBracket;
    }
}
