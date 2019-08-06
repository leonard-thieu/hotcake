import { BoundNodeKind } from '../BoundNodes';
import { BoundExpression } from './BoundExpressions';

export class BoundBooleanLiteralExpression extends BoundExpression {
    readonly kind = BoundNodeKind.BooleanLiteralExpression;

    value: string = undefined!;
}
