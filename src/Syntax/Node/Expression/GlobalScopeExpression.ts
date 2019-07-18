import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export const GlobalScopeExpressionChildNames: ReadonlyArray<keyof GlobalScopeExpression> = [
    'newlines',
];

export class GlobalScopeExpression extends Expression {
    readonly kind = NodeKind.GlobalScopeExpression;
}
