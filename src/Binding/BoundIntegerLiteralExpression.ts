import { BoundExpression } from './BoundExpression';
import { BoundNodeKind } from './BoundNodeKind';

export class BoundIntegerLiteralExpression extends BoundExpression {
    constructor() {
        super(BoundNodeKind.IntegerLiteralExpression, 'Int');
    }
}
