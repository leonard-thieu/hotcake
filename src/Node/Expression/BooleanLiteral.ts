import { Token } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class BooleanLiteral extends Expression {
    static CHILD_NAMES: (keyof BooleanLiteral)[] = [
        'newlines',
        'value',
    ];

    readonly kind = NodeKind.BooleanLiteral;

    value: Token;
}
