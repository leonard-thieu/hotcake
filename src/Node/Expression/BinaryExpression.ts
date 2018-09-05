import { NodeKind } from '../NodeKind';
import { BinaryExpressionBase } from './BinaryExpressionBase';

export class BinaryExpression extends BinaryExpressionBase {
    static CHILD_NAMES: (keyof BinaryExpression)[] = [
        'newlines',
        'leftOperand',
        'operator',
        'eachInKeyword',
        'rightOperand',
    ];

    readonly kind = NodeKind.BinaryExpression;
}
