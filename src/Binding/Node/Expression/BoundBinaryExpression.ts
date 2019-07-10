import { Type } from '../../Type/Type';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundBinaryExpression extends BoundExpression {
    constructor(
        type: Type,
        readonly leftOperand: BoundExpression,
        readonly rightOperand: BoundExpression,
    ) {
        super(BoundNodeKind.BinaryExpression, type);
    }
}
