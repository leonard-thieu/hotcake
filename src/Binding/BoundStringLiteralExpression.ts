import { BoundExpression } from './BoundExpression';
import { BoundNodeKind } from './BoundNodeKind';

export class BoundStringLiteralExpression extends BoundExpression {
    constructor() {
        super(BoundNodeKind.StringLiteralExpression, 'String');
    }
}
