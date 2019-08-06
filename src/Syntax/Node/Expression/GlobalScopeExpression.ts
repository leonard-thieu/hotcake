import { NodeKind } from '../Nodes';
import { Expression } from './Expressions';

export const GlobalScopeExpressionChildNames: ReadonlyArray<keyof GlobalScopeExpression> = [
    'newlines',
];

export class GlobalScopeExpression extends Expression {
    readonly kind = NodeKind.GlobalScopeExpression;
}
