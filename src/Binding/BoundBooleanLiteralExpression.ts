import { BoundExpression } from './BoundExpression';
import { BoundNodeKind } from './BoundNodeKind';

export class BoundBooleanLiteralExpression extends BoundExpression {
    constructor() {
        super(BoundNodeKind.BooleanLiteralExpression, 'Bool');
    }
}
