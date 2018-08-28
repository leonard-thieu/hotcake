import { MissingToken } from "../../MissingToken";
import { Token } from "../../Token";
import { NodeKind } from "../NodeKind";
import { Expression, Expressions } from "./Expression";

export class UnaryOpExpression extends Expression {
    static CHILD_NAMES: (keyof UnaryOpExpression)[] = [
        'operator',
        'operand',
    ];

    readonly kind = NodeKind.UnaryOpExpression;

    operator: Token;
    operand: Expressions | MissingToken;
}
