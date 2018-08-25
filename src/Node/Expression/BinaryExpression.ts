import { Token } from "../../Token";
import { Expression } from "./Expression";

export class BinaryExpression extends Expression {
    static CHILD_NAMES: (keyof BinaryExpression)[] = [
        'leftOperand',
        'operator',
        'rightOperand',
    ];

    leftOperand: Expression;
    operator: Token;
    rightOperand: Expression;
}
