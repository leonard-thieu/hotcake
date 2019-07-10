import { IntType } from '../../Type/IntType';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundIntegerLiteralExpression extends BoundExpression {
    constructor() {
        super(BoundNodeKind.IntegerLiteralExpression, IntType.type);
    }
}
