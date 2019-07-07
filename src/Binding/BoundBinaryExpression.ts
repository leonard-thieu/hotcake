import { BoundExpression } from './BoundExpression';
import { BoundNodeKind } from './BoundNodeKind';

export class BoundBinaryExpression extends BoundExpression {
    constructor(
        type: string,
        readonly leftOperand: BoundExpression,
        readonly rightOperand: BoundExpression,
    ) {
        super(BoundNodeKind.BinaryExpression, type);
    }
}
