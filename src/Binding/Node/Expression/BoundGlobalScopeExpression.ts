import { BoundNodeKind } from '../BoundNodes';
import { BoundExpression } from './BoundExpressions';

export class BoundGlobalScopeExpression extends BoundExpression {
    readonly kind = BoundNodeKind.GlobalScopeExpression;
}
