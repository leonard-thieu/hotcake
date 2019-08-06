import { BoundNodeKind } from '../BoundNodes';
import { BoundExpression } from './BoundExpressions';

export class BoundStringLiteralExpression extends BoundExpression {
    readonly kind = BoundNodeKind.StringLiteralExpression;

    value: string = undefined!;
}
