import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundGlobalScopeExpression extends BoundExpression {
    readonly kind = BoundNodeKind.GlobalScopeExpression;
}
