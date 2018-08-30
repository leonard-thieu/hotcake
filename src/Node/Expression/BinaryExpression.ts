import { MissingToken } from '../../Token/MissingToken';
import { Token } from '../../Token/Token';
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

    leftOperand: Expressions | MissingToken;
    operator: Token;
    eachInKeyword: Token | null = null;
    rightOperand: Expressions | MissingToken;
}
