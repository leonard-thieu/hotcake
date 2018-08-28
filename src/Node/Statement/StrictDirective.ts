import { Token } from "../../Token";
import { NodeKind } from "../NodeKind";
import { Statement } from "./Statement";

export class StrictDirective extends Statement {
    static CHILD_NAMES: (keyof StrictDirective)[] = [
        'strictKeyword',
    ];

    readonly kind = NodeKind.StrictDirective;

    strictKeyword: Token;
}
