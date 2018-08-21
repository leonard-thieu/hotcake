import { MissingToken } from '../../MissingToken';
import { Token } from '../../Token';
import { Expression } from './Expression';

export class StringLiteral extends Expression {
    static CHILD_NAMES: (keyof StringLiteral)[] = [
        'startQuote',
        'children',
        'endQuote',
    ];

    startQuote: Token | null = null;
    children: Array<Token> = [];
    endQuote: Token | MissingToken | null = null;
}
