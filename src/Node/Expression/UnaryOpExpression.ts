import { Token } from "../../Token";
import { Expression } from "./Expression";

export class UnaryOpExpression extends Expression {
    static CHILD_NAMES: (keyof UnaryOpExpression)[] = [
        'operator',
        'operand',
    ];

    operator: Token | null = null;
    operand: Expression | null = null;
}
