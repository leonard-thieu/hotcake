import { Token } from "../../Token";
import { NodeKind } from "../NodeKind";
import { Directive } from "./Directive";

export class EndDirective extends Directive {
    static CHILD_NAMES: (keyof EndDirective)[] = [
        'numberSign',
        'endDirectiveKeyword',
    ];

    readonly kind = NodeKind.EndDirective;

    endDirectiveKeyword: Token;
}
