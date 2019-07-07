import { BoundExpression } from './BoundExpression';
import { BoundNodeKind } from './BoundNodeKind';

export class BoundUnaryOpExpression extends BoundExpression {
    constructor(
        type: string,
        readonly operand: BoundExpression,
    ) {
        super(BoundNodeKind.UnaryOpExpression, type);
    }
}
