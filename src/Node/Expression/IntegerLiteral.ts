import { Token } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class IntegerLiteral extends Expression {
    static CHILD_NAMES: (keyof IntegerLiteral)[] = [
        'value',
    ];

    readonly kind = NodeKind.IntegerLiteral;

    value: Token;
}
