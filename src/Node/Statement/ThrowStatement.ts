import { MissingToken } from "../../MissingToken";
import { Token } from "../../Token";
import { Expression } from "../Expression/Expression";
import { NodeKind } from "../NodeKind";
import { Statement } from "./Statement";

export class ThrowStatement extends Statement {
    static CHILD_NAMES: (keyof ThrowStatement)[] = [
        'throwKeyword',
        'expression',
        'terminator',
    ];

    readonly kind = NodeKind.ThrowStatement;

    throwKeyword: Token;
    expression: Expression | MissingToken;
}
