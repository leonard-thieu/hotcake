import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { ClosingSquareBracketToken, OpeningSquareBracketToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class ArrayLiteral extends Expression {
    static CHILD_NAMES: (keyof ArrayLiteral)[] = [
        'openingSquareBracket',
        'expressions',
        'closingSquareBracket',
    ];

    readonly kind = NodeKind.ArrayLiteral;

    openingSquareBracket: OpeningSquareBracketToken;
    expressions: ParseContextElementArray<ParseContextKind.ExpressionSequence>;
    closingSquareBracket: ClosingSquareBracketToken;
}
