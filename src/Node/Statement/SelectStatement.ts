import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { MissingToken } from '../../Token/MissingToken';
import { Token } from '../../Token/Token';
import { Expressions } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class SelectStatement extends Statement {
    static CHILD_NAMES: (keyof SelectStatement)[] = [
        'selectKeyword',
        'expression',
        'newlines',
        'caseStatements',
        'defaultStatement',
        'endKeyword',
        'endSelectKeyword',
        'terminator',
    ];

    readonly kind = NodeKind.SelectStatement;

    selectKeyword: Token;
    expression: Expressions | MissingToken;
    newlines: Token[] = [];
    caseStatements: CaseStatement[] = [];
    defaultStatement: DefaultStatement | null = null;
    endKeyword: Token;
    endSelectKeyword: Token | null = null;
}

export class CaseStatement extends Statement {
    static CHILD_NAMES: (keyof CaseStatement)[] = [
        'caseKeyword',
        'expressions',
        'statements',
    ];

    readonly kind = NodeKind.CaseStatement;

    caseKeyword: Token;
    expressions: ParseContextElementArray<ParseContextKind.ExpressionSequence>;
    statements: ParseContextElementArray<CaseStatement['kind']>;
}

export class DefaultStatement extends Statement {
    static CHILD_NAMES: (keyof DefaultStatement)[] = [
        'defaultKeyword',
        'statements',
    ];

    readonly kind = NodeKind.DefaultStatement;

    defaultKeyword: Token;
    statements: ParseContextElementArray<DefaultStatement['kind']>;
}
