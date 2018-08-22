import { Token } from "../../Token";
import { Expression } from "./Expression";

export class IntegerLiteral extends Expression {
    static CHILD_NAMES: (keyof IntegerLiteral)[] = [
        'value',
    ];

    value: Token | null = null;
}
