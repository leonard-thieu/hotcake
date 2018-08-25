import { Token } from "../../Token";
import { NodeKind } from "../NodeKind";
import { Expression } from "./Expression";

export class BinaryExpression extends Expression {
    static CHILD_NAMES: (keyof BinaryExpression)[] = [
        'leftOperand',
        'operator',
        'rightOperand',
    ];

    readonly kind = NodeKind.BinaryExpression;

    leftOperand: Expression;
    operator: Token;
    rightOperand: Expression;
}
