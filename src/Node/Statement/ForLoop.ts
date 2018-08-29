import { MissingToken } from "../../MissingToken";
import { ParseContextElementArray } from "../../Parser";
import { Token } from "../../Token";
import { DataDeclarationList } from "../Declaration/DataDeclarationList";
import { BinaryExpression } from "../Expression/BinaryExpression";
import { Expression } from "../Expression/Expression";
import { Node } from "../Node";
import { NodeKind } from "../NodeKind";
import { Statement } from "./Statement";

export class ForLoop extends Statement {
    static CHILD_NAMES: (keyof ForLoop)[] = [
        'forKeyword',
        'statements',
        'endKeyword',
        'endForKeyword',
        'terminator',
    ];

    readonly kind = NodeKind.ForLoop;

    forKeyword: Token;
    header: NumericForLoopHeader | DataDeclarationList | BinaryExpression;
    statements: ParseContextElementArray<ForLoop['kind']>;
    endKeyword: Token;
    endForKeyword: Token | null = null;
}

export class NumericForLoopHeader extends Node {
    static CHILD_NAMES: (keyof NumericForLoopHeader)[] = [
        'loopVariableExpression',
        'toOrUntilKeyword',
        'lastValueExpression',
        'stepKeyword',
        'stepValueExpression',
    ];

    readonly kind = NodeKind.NumericForLoopHeader;

    loopVariableExpression: DataDeclarationList | BinaryExpression;
    toOrUntilKeyword: Token;
    lastValueExpression: Expression | MissingToken;
    stepKeyword: Token | null = null;
    stepValueExpression: Expression | MissingToken | null = null;
}
