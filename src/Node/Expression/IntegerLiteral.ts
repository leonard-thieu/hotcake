import { IntegerLiteralToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class IntegerLiteral extends Expression {
    static CHILD_NAMES: (keyof IntegerLiteral)[] = [
        'newlines',
        'value',
    ];

    readonly kind = NodeKind.IntegerLiteral;

    value: IntegerLiteralToken = undefined!;
}
