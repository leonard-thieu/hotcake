import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';
import { BoundExpressions } from './BoundExpressions';

export class BoundArrayLiteralExpression extends BoundExpression {
    readonly kind = BoundNodeKind.ArrayLiteralExpression;

    expressions: BoundExpressions[] = undefined!;
}
