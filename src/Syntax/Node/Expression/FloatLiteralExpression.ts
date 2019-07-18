import { FloatLiteralToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class FloatLiteralExpression extends Expression {
    readonly kind = NodeKind.FloatLiteralExpression;

    value: FloatLiteralToken = undefined!;
}
