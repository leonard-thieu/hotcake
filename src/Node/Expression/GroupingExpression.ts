import { Token } from "../../Token";
import { NodeKind } from "../NodeKind";
import { Expression } from "./Expression";

export class GroupingExpression extends Expression {
    static CHILD_NAMES: (keyof GroupingExpression)[] = [
        'openingParenthesis',
        'expression',
        'closingParenthesis',
    ];

    readonly kind = NodeKind.GroupingExpression;

    openingParenthesis: Token;
    expression: Expression;
    closingParenthesis: Token;
}
