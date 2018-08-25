import { Token } from "../../Token";
import { NodeKind } from "../NodeKind";
import { Expression, Expressions } from "./Expression";

export class BinaryExpression extends Expression {
    static CHILD_NAMES: (keyof BinaryExpression)[] = [
        'leftOperand',
        'operator',
        'rightOperand',
    ];

    readonly kind = NodeKind.BinaryExpression;

    leftOperand: Expressions;
    operator: Token;
    rightOperand: Expressions;
}
