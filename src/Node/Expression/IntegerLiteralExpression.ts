import { IntegerLiteralToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class IntegerLiteralExpression extends Expression {
    static CHILD_NAMES: (keyof IntegerLiteralExpression)[] = [
        'newlines',
        'value',
    ];

    readonly kind = NodeKind.IntegerLiteralExpression;

    value: IntegerLiteralToken = undefined!;

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
