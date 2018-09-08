import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { ClosingSquareBracketToken, NewlineToken, OpeningSquareBracketToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class ArrayLiteral extends Expression {
    static CHILD_NAMES: (keyof ArrayLiteral)[] = [
        'openingSquareBracket',
        'newline',
        'expressions',
        'closingSquareBracket',
    ];

    readonly kind = NodeKind.ArrayLiteral;

    openingSquareBracket: OpeningSquareBracketToken;
    newline: NewlineToken | null = null;
    expressions: ParseContextElementArray<ParseContextKind.ExpressionSequence>;
    closingSquareBracket: MissableToken<ClosingSquareBracketToken>;
}
