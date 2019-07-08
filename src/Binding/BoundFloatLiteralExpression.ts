import { BoundExpression } from './BoundExpression';
import { BoundNodeKind } from './BoundNodeKind';
import { FloatType } from './Type/FloatType';

export class BoundFloatLiteralExpression extends BoundExpression {
    constructor() {
        super(BoundNodeKind.FloatLiteralExpression, FloatType.type);
    }
}
