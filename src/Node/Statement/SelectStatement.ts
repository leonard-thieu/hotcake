import { ParseContextElementArray, ParseContextElementDelimitedSequence, ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { CaseKeywordToken, DefaultKeywordToken, EndKeywordToken, SelectKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
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
    expression: MissableExpression;
    newlines: ParseContextElementSequence<ParseContextKind.NewlineList>;
    caseStatements: CaseStatement[] = [];
    defaultStatement: DefaultStatement | null = null;
    endKeyword: MissableToken<EndKeywordToken>;
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
    expressions: ParseContextElementDelimitedSequence<ParseContextKind.ExpressionSequence>;
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
