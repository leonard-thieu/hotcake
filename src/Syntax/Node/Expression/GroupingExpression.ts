import { MissableToken } from '../../Token/MissingToken';
import { ClosingParenthesisToken, OpeningParenthesisToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, MissableExpression } from './Expression';

export class GroupingExpression extends Expression {
    static CHILD_NAMES: (keyof GroupingExpression)[] = [
        'newlines',
        'openingParenthesis',
        'expression',
        'closingParenthesis',
    ];

    readonly kind = NodeKind.GroupingExpression;

    openingParenthesis: OpeningParenthesisToken = undefined!;
    expression: MissableExpression = undefined!;
    closingParenthesis: MissableToken<ClosingParenthesisToken> = undefined!;

    get firstToken() {
        if (this.newlines && this.newlines.length !== 0) {
            return this.newlines[0];
        }

        return this.openingParenthesis;
    }

    get lastToken() {
        return this.closingParenthesis;
    }
}
