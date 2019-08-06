import { BoundNodeKind } from '../BoundNodes';
import { BoundExpression, BoundExpressions } from './BoundExpressions';

export class BoundSliceExpression extends BoundExpression {
    readonly kind = BoundNodeKind.SliceExpression;

    sliceableExpression: BoundExpressions = undefined!;
    startExpression?: BoundExpressions = undefined;
    endExpression?: BoundExpressions = undefined;
}
