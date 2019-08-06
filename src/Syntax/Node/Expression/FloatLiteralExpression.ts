import { FloatLiteralToken } from '../../Token/Tokens';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export const FloatLiteralExpressionChildNames: ReadonlyArray<keyof FloatLiteralExpression> = [
    'newlines',
    'value',
];

export class FloatLiteralExpression extends Expression {
    readonly kind = NodeKind.FloatLiteralExpression;

    value: FloatLiteralToken = undefined!;
}
