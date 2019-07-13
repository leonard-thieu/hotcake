import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundInvokeExpression extends BoundExpression {
    readonly kind = BoundNodeKind.InvokeExpression;

    invokableExpression: BoundExpression = undefined!;
    arguments: BoundExpression[] = undefined!;
}
