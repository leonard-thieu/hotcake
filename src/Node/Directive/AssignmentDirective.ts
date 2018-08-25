import { MissingToken } from "../../MissingToken";
import { Token } from "../../Token";
import { Expressions } from "../Expression/Expression";
import { NodeKind } from "../NodeKind";
import { Directive } from "./Directive";

export class AssignmentDirective extends Directive {
    static CHILD_NAMES: (keyof AssignmentDirective)[] = [
        'numberSign',
        'name',
        'operator',
        'expression',
    ];

    readonly kind = NodeKind.AssignmentDirective;

    name: Token;
    operator: Token;
    expression: Expressions | MissingToken;
}
