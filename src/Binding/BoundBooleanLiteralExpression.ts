import { BoundExpression } from './BoundExpression';
import { BoundNodeKind } from './BoundNodeKind';
import { BoolType } from './Type/BoolType';

export class BoundBooleanLiteralExpression extends BoundExpression {
    constructor() {
        super(BoundNodeKind.BooleanLiteralExpression, BoolType.type);
    }
}
