import { FloatLiteralToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class FloatLiteralExpression extends Expression {
    static CHILD_NAMES: (keyof FloatLiteralExpression)[] = [
        'newlines',
        'value',
    ];

    readonly kind = NodeKind.FloatLiteralExpression;

    value: FloatLiteralToken = undefined!;

    get firstToken() {
        if (this.newlines && this.newlines.length !== 0) {
            return this.newlines[0];
        }

        return this.value;
    }

    get lastToken() {
        return this.value;
    }
}
