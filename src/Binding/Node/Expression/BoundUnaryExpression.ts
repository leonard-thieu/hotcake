import { Type } from '../../Type/Type';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundUnaryExpression extends BoundExpression {
    constructor(
        type: Type,
        readonly operand: BoundExpression,
    ) {
        super(BoundNodeKind.UnaryExpression, type);
    }
}
