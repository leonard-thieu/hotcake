import { BoundNodeKind } from '../BoundNodes';
import { BoundExpression, BoundExpressions } from './BoundExpressions';

export class BoundIndexExpression extends BoundExpression {
    readonly kind = BoundNodeKind.IndexExpression;

    indexableExpression: BoundExpressions = undefined!;
    indexExpressionExpression: BoundExpressions = undefined!;
}
