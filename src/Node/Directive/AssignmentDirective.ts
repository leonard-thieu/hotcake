import { MissingToken } from "../../MissingToken";
import { Token } from "../../Token";
import { Expression } from "../Expression/Expression";
import { Directive } from "./Directive";

export class AssignmentDirective extends Directive {
    static CHILD_NAMES: (keyof AssignmentDirective)[] = [
        'numberSign',
        'name',
        'operator',
        'expression',
    ];

    name: Token | null = null;
    operator: Token | null = null;
    expression: Expression | MissingToken | null = null;
}
