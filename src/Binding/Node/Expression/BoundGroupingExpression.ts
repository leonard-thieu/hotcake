import { BoundNodeKind } from '../BoundNodes';
import { BoundExpression, BoundExpressions } from './BoundExpressions';

export class BoundGroupingExpression extends BoundExpression {
    readonly kind = BoundNodeKind.GroupingExpression;

    expression: BoundExpressions = undefined!;
}
