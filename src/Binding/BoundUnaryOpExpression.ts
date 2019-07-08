import { BoundExpression } from './BoundExpression';
import { BoundNodeKind } from './BoundNodeKind';
import { Type } from './Type/Type';

export class BoundUnaryOpExpression extends BoundExpression {
    constructor(
        type: Type,
        readonly operand: BoundExpression,
    ) {
        super(BoundNodeKind.UnaryOpExpression, type);
    }
}
