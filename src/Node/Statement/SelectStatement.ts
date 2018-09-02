import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { MissingToken } from '../../Token/MissingToken';
import { CaseKeywordToken, DefaultKeywordToken, EndKeywordToken, NewlineToken, SelectKeywordToken } from '../../Token/Token';
import { Expression } from '../Expression/Expression';
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

    selectKeyword: SelectKeywordToken;
    expression: Expression | MissingToken;
    newlines: NewlineToken[] = [];
    caseStatements: CaseStatement[] = [];
    defaultStatement: DefaultStatement | null = null;
    endKeyword: EndKeywordToken;
    endSelectKeyword: SelectKeywordToken | null = null;
}

export class CaseStatement extends Statement {
    static CHILD_NAMES: (keyof CaseStatement)[] = [
        'caseKeyword',
        'expressions',
        'statements',
    ];

    readonly kind = NodeKind.CaseStatement;

    caseKeyword: CaseKeywordToken;
    expressions: ParseContextElementArray<ParseContextKind.ExpressionSequence>;
    statements: ParseContextElementArray<CaseStatement['kind']>;
}

export class DefaultStatement extends Statement {
    static CHILD_NAMES: (keyof DefaultStatement)[] = [
        'defaultKeyword',
        'statements',
    ];

    readonly kind = NodeKind.DefaultStatement;

    defaultKeyword: DefaultKeywordToken;
    statements: ParseContextElementArray<DefaultStatement['kind']>;
}
