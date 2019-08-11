import { BoundNodeKind } from '../BoundNodes';
import { BoundExpression, BoundExpressions } from './BoundExpressions';

export class BoundBinaryExpression extends BoundExpression {
    readonly kind = BoundNodeKind.BinaryExpression;

    leftOperand: BoundExpressions = undefined!;
    operator: BoundBinaryExpressionOperator = undefined!;
    rightOperand: BoundExpressions = undefined!;
}

export enum BoundBinaryExpressionOperator {
    ConditionalOr = 'ConditionalOr',
    ConditionalAnd = 'ConditionalAnd',
    NotEquals = 'NotEquals',
    GreaterThanOrEquals = 'GreaterThanOrEquals',
    LessThanOrEquals = 'LessThanOrEquals',
    GreaterThan = 'GreaterThan',
    LessThan = 'LessThan',
    Equals = 'Equals',
    BitwiseOr = 'BitwiseOr',
    BitwiseXor = 'BitwiseXor',
    BitwiseAnd = 'BitwiseAnd',
    Subtraction = 'Subtraction',
    Addition = 'Addition',
    BitwiseShiftRight = 'BitwiseShiftRight',
    BitwiseShiftLeft = 'BitwiseShiftLeft',
    Modulus = 'Modulus',
    Division = 'Division',
    Multiplication = 'Multiplication',
}
