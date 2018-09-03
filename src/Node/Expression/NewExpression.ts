import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { ClosingParenthesisToken, NewKeywordToken, OpeningParenthesisToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { TypeReference } from '../TypeReference';
import { Expression } from './Expression';

export class NewExpression extends Expression {
    static CHILD_NAMES: (keyof NewExpression)[] = [
        'newlines',
        'newKeyword',
        'type',
        'openingParenthesis',
        'arguments',
        'closingParenthesis',
    ];

    readonly kind = NodeKind.NewExpression;

    newKeyword: NewKeywordToken;
    type: TypeReference;
    openingParenthesis: OpeningParenthesisToken | null;
    arguments: ParseContextElementArray<ParseContextKind.ExpressionSequence>;
    closingParenthesis: ClosingParenthesisToken | null;
}
