import { BoundFunctionLikeDeclaration } from '../../Type/FunctionLikeType';
import { BoundNodeKind } from '../BoundNodes';
import { BoundExpression, BoundExpressions } from './BoundExpressions';

export class BoundInvokeExpression extends BoundExpression {
    readonly kind = BoundNodeKind.InvokeExpression;

    overload: BoundFunctionLikeDeclaration = undefined!;
    invocableExpression: BoundExpressions = undefined!;
    arguments: BoundExpressions[] = undefined!;
}
