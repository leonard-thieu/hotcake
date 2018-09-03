import { FloatLiteralToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class FloatLiteral extends Expression {
    static CHILD_NAMES: (keyof FloatLiteral)[] = [
        'newlines',
        'value',
    ];

    readonly kind = NodeKind.FloatLiteral;

    value: FloatLiteralToken;
}
