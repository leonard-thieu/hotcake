import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundIntegerLiteralExpression extends BoundExpression {
    readonly kind = BoundNodeKind.IntegerLiteralExpression;

    value: string = undefined!;
}
