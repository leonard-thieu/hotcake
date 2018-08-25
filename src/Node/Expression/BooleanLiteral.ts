import { Token } from "../../Token";
import { NodeKind } from "../NodeKind";
import { Expression } from "./Expression";

export class BooleanLiteral extends Expression {
    static CHILD_NAMES: (keyof BooleanLiteral)[] = [
        'value',
    ];

    readonly kind = NodeKind.BooleanLiteral;

    value: Token;
}
