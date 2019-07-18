import { ParseContextElementDelimitedSequence, ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { ClosingSquareBracketToken, OpeningSquareBracketToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class ArrayLiteralExpression extends Expression {
    readonly kind = NodeKind.ArrayLiteralExpression;

    openingSquareBracket: OpeningSquareBracketToken = undefined!;
    leadingNewlines: ParseContextElementSequence<ParseContextKind.NewlineList> = undefined!;
    expressions: ParseContextElementDelimitedSequence<ParseContextKind.ExpressionSequence> = undefined!;
    closingSquareBracket: MissableToken<ClosingSquareBracketToken> = undefined!;
}
