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

    name: Token;
    operator: Token;
    expression: Expression | MissingToken;
}
