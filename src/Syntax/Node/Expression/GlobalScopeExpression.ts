import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class GlobalScopeExpression extends Expression {
    readonly kind = NodeKind.GlobalScopeExpression;
}
