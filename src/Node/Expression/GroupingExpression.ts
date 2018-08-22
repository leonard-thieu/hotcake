import { Token } from "../../Token";
import { Expression } from "./Expression";

export class GroupingExpression extends Expression {
    static CHILD_NAMES: (keyof GroupingExpression)[] = [
        'openingParenthesis',
        'expression',
        'closingParenthesis',
    ];

    openingParenthesis: Token | null = null;
    expression: Expression | null = null;
    closingParenthesis: Token | null = null;
}
