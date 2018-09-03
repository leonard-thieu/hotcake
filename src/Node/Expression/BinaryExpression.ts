import { EachInKeywordToken, MissingExpressionToken, Tokens } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, Expressions } from './Expression';

export class BinaryExpression extends Expression {
    static CHILD_NAMES: (keyof BinaryExpression)[] = [
        'newlines',
        'leftOperand',
        'operator',
        'eachInKeyword',
        'rightOperand',
    ];

    readonly kind = NodeKind.BinaryExpression;

    leftOperand: Expressions | MissingExpressionToken;
    operator: Tokens;
    eachInKeyword: EachInKeywordToken | null = null;
    rightOperand: Expressions | MissingExpressionToken;
}
