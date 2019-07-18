import { MissableExpression } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class ExpressionStatement extends Statement {
    readonly kind = NodeKind.ExpressionStatement;

    expression: MissableExpression = undefined!;
}
