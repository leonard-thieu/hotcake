import { MissingExpressionToken, Tokens } from '../../Token/Token';
import { Expression, Expressions } from './Expression';

export abstract class BinaryExpressionBase extends Expression {
    leftOperand: Expressions | MissingExpressionToken;
    operator: Tokens;
    rightOperand: Expressions | MissingExpressionToken;
}
