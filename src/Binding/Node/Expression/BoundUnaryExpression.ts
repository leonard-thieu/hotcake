import { BoundNodeKind } from '../BoundNodes';
import { BoundExpression, BoundExpressions } from './BoundExpressions';

export class BoundUnaryExpression extends BoundExpression {
    readonly kind = BoundNodeKind.UnaryExpression;

    operator: BoundUnaryExpressionOperator = undefined!;
    operand: BoundExpressions = undefined!;
}

export enum BoundUnaryExpressionOperator {
    UnaryPlus = 'UnaryPlus',
    UnaryMinus = 'UnaryMinus',
    BitwiseComplement = 'BitwiseComplement',
    BooleanInverse = 'BooleanInverse',
}
