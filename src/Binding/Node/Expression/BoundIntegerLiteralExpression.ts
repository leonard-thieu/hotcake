import { BoundNodeKind } from '../BoundNodes';
import { BoundExpression } from './BoundExpressions';

export class BoundIntegerLiteralExpression extends BoundExpression {
    readonly kind = BoundNodeKind.IntegerLiteralExpression;

    value: string = undefined!;
}
