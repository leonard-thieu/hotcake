import { MissingToken } from "../../MissingToken";
import { ParseContextElementArray } from "../../Parser";
import { Token } from "../../Token";
import { Expression } from "../Expression/Expression";
import { NodeKind } from "../NodeKind";
import { Statement } from "./Statement";

export class WhileLoop extends Statement {
    static CHILD_NAMES: (keyof WhileLoop)[] = [
        'whileKeyword',
        'expression',
        'statements',
        'endKeyword',
        'endWhileKeyword',
        'terminator',
    ];

    readonly kind = NodeKind.WhileLoop;

    whileKeyword: Token;
    expression: Expression | MissingToken;
    statements: ParseContextElementArray<WhileLoop['kind']>;
    endKeyword: Token;
    endWhileKeyword: Token | null = null;
}
