import { IntegerLiteralToken } from '../../Token/Tokens';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export const IntegerLiteralExpressionChildNames: ReadonlyArray<keyof IntegerLiteralExpression> = [
    'newlines',
    'value',
];

export class IntegerLiteralExpression extends Expression {
    readonly kind = NodeKind.IntegerLiteralExpression;

    value: IntegerLiteralToken = undefined!;
}
