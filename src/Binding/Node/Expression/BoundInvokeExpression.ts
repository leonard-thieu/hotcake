import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundInvokeExpression extends BoundExpression {
    readonly kind = BoundNodeKind.InvokeExpression;

    parent: BoundNode = undefined!;

    invokableExpression: BoundExpression = undefined!;
    arguments: BoundExpression[] = undefined!;
}
