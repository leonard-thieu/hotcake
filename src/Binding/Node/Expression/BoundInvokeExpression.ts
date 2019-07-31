import { FunctionLikeTypes } from '../../Type/FunctionLikeType';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';
import { BoundExpressions } from './BoundExpressions';

export class BoundInvokeExpression extends BoundExpression {
    readonly kind = BoundNodeKind.InvokeExpression;

    invocationType?: FunctionLikeTypes = undefined;

    invokableExpression: BoundExpressions = undefined!;
    arguments: BoundExpressions[] = undefined!;
}
