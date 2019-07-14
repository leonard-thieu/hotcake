import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';
import { BoundExpressions } from './BoundExpressions';

export class BoundGroupingExpression extends BoundExpression {
    readonly kind = BoundNodeKind.GroupingExpression;

    expression: BoundExpressions = undefined!;
}
