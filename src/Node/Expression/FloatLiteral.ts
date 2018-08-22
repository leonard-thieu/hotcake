import { Token } from "../../Token";
import { Expression } from "./Expression";

export class FloatLiteral extends Expression {
    static CHILD_NAMES: (keyof FloatLiteral)[] = [
        'value',
    ];

    value: Token | null = null;
}
