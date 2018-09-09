import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
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
    leadingNewlines: ParseContextElementArray<ParseContextKind.NewlineList>;
    expressions: ParseContextElementArray<ParseContextKind.ExpressionSequence>;
    closingSquareBracket: MissableToken<ClosingSquareBracketToken>;
}
