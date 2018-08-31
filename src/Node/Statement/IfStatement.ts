import { ParseContextElementArray } from '../../ParserBase';
import { MissingToken } from '../../Token/MissingToken';
import { Token } from '../../Token/Token';
import { Expression } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class IfStatement extends Statement {
    static CHILD_NAMES: (keyof IfStatement)[] = [
        'ifKeyword',
        'expression',
        'thenKeyword',
        'statements',
        'elseIfStatements',
        'elseStatement',
        'endKeyword',
        'endIfKeyword',
        'terminator',
    ];

    readonly kind = NodeKind.IfStatement;

    ifKeyword: Token;
    expression: Expression | MissingToken;
    thenKeyword: Token | null = null;
    statements: ParseContextElementArray<IfStatement['kind']>;
    elseIfStatements: ElseIfStatement[] | null = null;
    elseStatement: ElseStatement | null = null;
    endKeyword: Token | null = null;
    endIfKeyword: Token | null = null;
}

export class ElseIfStatement extends Statement {
    static CHILD_NAMES: (keyof ElseIfStatement)[] = [
        'elseIfKeyword',
        'ifKeyword',
        'expression',
        'thenKeyword',
        'statements',
    ];

    readonly kind = NodeKind.ElseIfStatement;

    elseIfKeyword: Token;
    ifKeyword: Token | null = null;
    expression: Expression | MissingToken;
    thenKeyword: Token | null = null;
    statements: ParseContextElementArray<ElseIfStatement['kind']>;
}

export class ElseStatement extends Statement {
    static CHILD_NAMES: (keyof ElseStatement)[] = [
        'elseKeyword',
        'statements',
    ];

    readonly kind = NodeKind.ElseStatement;

    elseKeyword: Token;
    statements: ParseContextElementArray<ElseStatement['kind']>;
}
