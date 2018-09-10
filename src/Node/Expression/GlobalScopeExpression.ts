import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class GlobalScopeExpression extends Expression {
    static CHILD_NAMES: (keyof GlobalScopeExpression)[] = [
        'newlines',
    ];

    readonly kind = NodeKind.GlobalScopeExpression;
}
