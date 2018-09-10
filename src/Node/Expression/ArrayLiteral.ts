import { ParseContextElementDelimitedSequence, ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { ClosingSquareBracketToken, OpeningSquareBracketToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class ArrayLiteral extends Expression {
    static CHILD_NAMES: (keyof ArrayLiteral)[] = [
        'newlines',
        'openingSquareBracket',
        'leadingNewlines',
        'expressions',
        'closingSquareBracket',
    ];

    readonly kind = NodeKind.ArrayLiteral;

    openingSquareBracket: OpeningSquareBracketToken;
    leadingNewlines: ParseContextElementSequence<ParseContextKind.NewlineList>;
    expressions: ParseContextElementDelimitedSequence<ParseContextKind.ExpressionSequence>;
    closingSquareBracket: MissableToken<ClosingSquareBracketToken>;
}
