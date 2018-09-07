import { MissableExpression } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class ExpressionStatement extends Statement {
    static CHILD_NAMES: (keyof ExpressionStatement)[] = [
        'expression',
        'terminator',
    ];

    readonly kind = NodeKind.ExpressionStatement;

    expression: MissableExpression;
}
