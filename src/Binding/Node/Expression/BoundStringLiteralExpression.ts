import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundStringLiteralExpression extends BoundExpression {
    readonly kind = BoundNodeKind.StringLiteralExpression;

    value: string = undefined!;
}
