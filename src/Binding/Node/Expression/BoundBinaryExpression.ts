import { BinaryExpressionOperatorToken } from '../../../Syntax/Node/Expression/BinaryExpression';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';
import { BoundExpressions } from './BoundExpressions';

export class BoundBinaryExpression extends BoundExpression {
    readonly kind = BoundNodeKind.BinaryExpression;

    leftOperand: BoundExpressions = undefined!;
    operator: BinaryExpressionOperatorToken['kind'] = undefined!;
    rightOperand: BoundExpressions = undefined!;
}
