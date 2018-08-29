import { Token } from "../../Token";
import { DataDeclaration } from "../DataDeclaration";
import { NodeKind } from "../NodeKind";
import { Statement } from "./Statement";

export class TryStatement extends Statement {
    static CHILD_NAMES: (keyof TryStatement)[] = [
        'tryKeyword',
        'statements',
        'catchStatements',
        'endKeyword',
        'endTryKeyword',
        'terminator',
    ];

    readonly kind = NodeKind.TryStatement;

    tryKeyword: Token;
    statements: Array<Statement | Token>;
    catchStatements: CatchStatement[] = [];
    endKeyword: Token;
    endTryKeyword: Token | null = null;
}

export class CatchStatement extends Statement {
    static CHILD_NAMES: (keyof CatchStatement)[] = [
        'catchKeyword',
        'parameter',
        'statements',
    ];

    readonly kind = NodeKind.CatchStatement;

    catchKeyword: Token;
    parameter: DataDeclaration;
    statements: Array<Statement | Token>;
}
