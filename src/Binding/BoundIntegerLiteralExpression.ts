import { BoundExpression } from './BoundExpression';
import { BoundNodeKind } from './BoundNodeKind';
import { IntType } from './Type/IntType';

export class BoundIntegerLiteralExpression extends BoundExpression {
    constructor() {
        super(BoundNodeKind.IntegerLiteralExpression, IntType.type);
    }
}
