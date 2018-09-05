import { NodeKind } from '../NodeKind';
import { BinaryExpressionBase } from './BinaryExpressionBase';

export class AssignmentExpression extends BinaryExpressionBase {
    static CHILD_NAMES: (keyof AssignmentExpression)[] = [
        'newlines',
        'leftOperand',
        'operator',
        'eachInKeyword',
        'rightOperand',
    ];

    readonly kind = NodeKind.AssignmentExpression;
}
