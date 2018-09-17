import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class GlobalScopeExpression extends Expression {
    static CHILD_NAMES: (keyof GlobalScopeExpression)[] = [
        'newlines',
    ];

    readonly kind = NodeKind.GlobalScopeExpression;

    get firstToken() {
        return this.newlines![0];
    }

    get lastToken() {
        return this.newlines![this.newlines!.length - 1];
    }
}
