import { ParseContextElementDelimitedSequence, ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { ClosingSquareBracketToken, OpeningSquareBracketToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class ArrayLiteralExpression extends Expression {
    static CHILD_NAMES: (keyof ArrayLiteralExpression)[] = [
        'newlines',
        'openingSquareBracket',
        'leadingNewlines',
        'expressions',
        'closingSquareBracket',
    ];

    readonly kind = NodeKind.ArrayLiteralExpression;

    openingSquareBracket: OpeningSquareBracketToken = undefined!;
    leadingNewlines: ParseContextElementSequence<ParseContextKind.NewlineList> = undefined!;
    expressions: ParseContextElementDelimitedSequence<ParseContextKind.ExpressionSequence> = undefined!;
    closingSquareBracket: MissableToken<ClosingSquareBracketToken> = undefined!;

    get firstToken() {
        if (this.newlines && this.newlines.length !== 0) {
            return this.newlines[0];
        }

        return this.openingSquareBracket;
    }

    get lastToken() {
        return this.closingSquareBracket;
    }
}
