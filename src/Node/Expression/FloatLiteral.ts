import { Token } from "../../Token";
import { NodeKind } from "../NodeKind";
import { Expression } from "./Expression";

export class FloatLiteral extends Expression {
    static CHILD_NAMES: (keyof FloatLiteral)[] = [
        'value',
    ];

    readonly kind = NodeKind.FloatLiteral;

    value: Token;
}
