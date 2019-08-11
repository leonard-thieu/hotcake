import { BoundNodeKind } from '../BoundNodes';
import { BoundExpression, BoundExpressions } from './BoundExpressions';

export class BoundArrayLiteralExpression extends BoundExpression {
    readonly kind = BoundNodeKind.ArrayLiteralExpression;

    expressions: BoundExpressions[] = undefined!;
}
