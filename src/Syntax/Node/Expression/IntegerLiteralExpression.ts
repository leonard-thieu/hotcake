import { IntegerLiteralToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class IntegerLiteralExpression extends Expression {
    readonly kind = NodeKind.IntegerLiteralExpression;

    value: IntegerLiteralToken = undefined!;
}
