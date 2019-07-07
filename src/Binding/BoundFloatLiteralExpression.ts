import { BoundExpression } from './BoundExpression';
import { BoundNodeKind } from './BoundNodeKind';

export class BoundFloatLiteralExpression extends BoundExpression {
    constructor() {
        super(BoundNodeKind.FloatLiteralExpression, 'Float');
    }
}
