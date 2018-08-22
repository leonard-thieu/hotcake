import { Token } from "../../Token";
import { Expression } from "./Expression";

export class BooleanLiteral extends Expression {
    static CHILD_NAMES: (keyof BooleanLiteral)[] = [
        'value',
    ];

    value: Token | null = null;
}
