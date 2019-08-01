import { UnaryOperatorToken } from '../../../Syntax/Node/Expression/UnaryExpression';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';
import { BoundExpressions } from './BoundExpressions';

export class BoundUnaryExpression extends BoundExpression {
    readonly kind = BoundNodeKind.UnaryExpression;

    operator: UnaryOperatorToken['kind'] = undefined!;
    operand: BoundExpressions = undefined!;
}
