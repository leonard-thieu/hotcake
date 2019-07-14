import { MissableToken } from '../../Token/MissingToken';
import { ClosingSquareBracketToken, ErrorableToken, OpeningSquareBracketToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, Expressions, MissableExpression } from './Expression';

export class IndexExpression extends Expression {
    static CHILD_NAMES: (keyof IndexExpression)[] = [
        'newlines',
        'indexableExpression',
        'openingSquareBracket',
        'indexExpressionExpression',
        'closingSquareBracket',
    ];

    readonly kind = NodeKind.IndexExpression;

    indexableExpression: Expressions = undefined!;
    openingSquareBracket: OpeningSquareBracketToken = undefined!;
    indexExpressionExpression: MissableExpression = undefined!;
    closingSquareBracket: MissableToken<ClosingSquareBracketToken> = undefined!;

    get firstToken(): ErrorableToken {
        if (this.newlines && this.newlines.length !== 0) {
            return this.newlines[0];
        }

        return this.indexableExpression.firstToken;
    }

    get lastToken() {
        return this.closingSquareBracket;
    }
}
