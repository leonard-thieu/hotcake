import { BoundExpression } from './BoundExpression';
import { BoundNodeKind } from './BoundNodeKind';
import { StringType } from './Type/StringType';

export class BoundStringLiteralExpression extends BoundExpression {
    constructor() {
        super(BoundNodeKind.StringLiteralExpression, StringType.type);
    }
}
