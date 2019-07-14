import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';
import { BoundExpressions } from './BoundExpressions';

export class BoundIndexExpression extends BoundExpression {
    readonly kind = BoundNodeKind.IndexExpression;

    indexableExpression: BoundExpressions = undefined!;
    indexExpressionExpression: BoundExpressions = undefined!;
}
