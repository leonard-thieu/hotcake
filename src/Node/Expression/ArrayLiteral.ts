import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { Token } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class ArrayLiteral extends Expression {
    static CHILD_NAMES: (keyof ArrayLiteral)[] = [
        'openingSquareBracket',
        'expressions',
        'closingSquareBracket',
    ];

    readonly kind = NodeKind.ArrayLiteral;

    openingSquareBracket: Token;
    expressions: ParseContextElementArray<ParseContextKind.ExpressionSequence>;
    closingSquareBracket: Token;
}
