import { MissingToken } from '../../MissingToken';
import { Token } from '../../Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class StringLiteral extends Expression {
    static CHILD_NAMES: (keyof StringLiteral)[] = [
        'startQuote',
        'children',
        'endQuote',
    ];

    readonly kind = NodeKind.StringLiteral;

    startQuote: Token;
    children: Array<Token> = [];
    endQuote: Token | MissingToken;
}
