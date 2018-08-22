import { Token } from "../../Token";
import { Expression } from "./Expression";

export class Variable extends Expression {
    static CHILD_NAMES: (keyof Variable)[] = [
        'name',
    ];

    name: Token | null = null;
}
