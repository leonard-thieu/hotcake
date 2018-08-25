import { Token } from "../../Token";
import { NodeKind } from "../NodeKind";
import { Expression } from "./Expression";

export class Variable extends Expression {
    static CHILD_NAMES: (keyof Variable)[] = [
        'name',
    ];

    readonly kind = NodeKind.Variable;

    name: Token;
}
