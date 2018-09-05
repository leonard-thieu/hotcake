import { EachInKeywordToken, MissingExpressionToken, Tokens } from '../../Token/Token';
import { Expression, Expressions } from './Expression';

export abstract class BinaryExpressionBase extends Expression {
    leftOperand: Expressions | MissingExpressionToken;
    operator: Tokens;
    eachInKeyword: EachInKeywordToken | null = null;
    rightOperand: Expressions | MissingExpressionToken;
}
