import { FunctionLikeTypes } from '../../Type/FunctionLikeType';
import { BoundNodeKind } from '../BoundNodes';
import { BoundExpression, BoundExpressions } from './BoundExpressions';

export class BoundInvokeExpression extends BoundExpression {
    readonly kind = BoundNodeKind.InvokeExpression;

    invocationType?: FunctionLikeTypes = undefined;

    invokableExpression: BoundExpressions = undefined!;
    arguments: BoundExpressions[] = undefined!;
}
