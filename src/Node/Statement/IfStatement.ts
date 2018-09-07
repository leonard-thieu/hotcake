import { ParseContextElementArray } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { ElseIfKeywordToken, ElseKeywordToken, EndIfKeywordToken, EndKeywordToken, IfKeywordToken, ThenKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class IfStatement extends Statement {
    static CHILD_NAMES: (keyof IfStatement)[] = [
        'ifKeyword',
        'expression',
        'thenKeyword',
        'isSingleLine',
        'statements',
        'elseIfStatements',
        'elseStatement',
        'endKeyword',
        'endIfKeyword',
        'terminator',
    ];

    readonly kind = NodeKind.IfStatement;

    ifKeyword: IfKeywordToken;
    expression: MissableExpression;
    thenKeyword: ThenKeywordToken | null = null;
    isSingleLine: boolean = false;
    statements: ParseContextElementArray<IfStatement['kind']>;
    elseIfStatements: ElseIfStatement[] | null = null;
    elseStatement: ElseStatement | null = null;
    endKeyword: MissableToken<EndIfKeywordToken | EndKeywordToken> | null = null;
    endIfKeyword: IfKeywordToken | null = null;
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

    elseIfKeyword: ElseIfKeywordToken | ElseKeywordToken;
    ifKeyword: IfKeywordToken | null = null;
    expression: MissableExpression;
    thenKeyword: ThenKeywordToken | null = null;
    statements: ParseContextElementArray<ElseIfStatement['kind']>;
}

export class ElseStatement extends Statement {
    static CHILD_NAMES: (keyof ElseStatement)[] = [
        'elseKeyword',
        'statements',
    ];

    readonly kind = NodeKind.ElseStatement;

    elseKeyword: ElseKeywordToken;
    statements: ParseContextElementArray<ElseStatement['kind']>;
}
