import { BoundExpression } from './BoundExpression';
import { BoundNodeKind } from './BoundNodeKind';
import { Type } from './Type/Type';

export class BoundBinaryExpression extends BoundExpression {
    constructor(
        type: Type,
        readonly leftOperand: BoundExpression,
        readonly rightOperand: BoundExpression,
    ) {
        super(BoundNodeKind.BinaryExpression, type);
    }
}
