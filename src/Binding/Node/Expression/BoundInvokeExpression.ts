import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundInvokeExpression extends BoundExpression {
    readonly kind = BoundNodeKind.InvokeExpression;
    
    arguments: BoundExpression[] = undefined!;
}
