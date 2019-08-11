import { BoundNodeKind } from '../BoundNodes';
import { BoundExpression } from './BoundExpressions';

export class BoundFloatLiteralExpression extends BoundExpression {
    readonly kind = BoundNodeKind.FloatLiteralExpression;

    value: string = undefined!;
}
