import { ParseContextElementArray, ParseContextElementDelimitedSequence, ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { CaseKeywordToken, DefaultKeywordToken, EndKeywordToken, SelectKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { Node } from '../Node';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export const SelectStatementChildNames: ReadonlyArray<keyof SelectStatement> = [
    'selectKeyword',
    'expression',
    'newlines',
    'caseClauses',
    'defaultClause',
    'endKeyword',
    'endSelectKeyword',
    'terminator',
];

export class SelectStatement extends Statement {
    readonly kind = NodeKind.SelectStatement;

    selectKeyword: SelectKeywordToken = undefined!;
    expression: MissableExpression = undefined!;
    newlines: ParseContextElementSequence<ParseContextKind.NewlineList> = undefined!;
    caseClauses: ParseContextElementSequence<ParseContextKind.CaseClauseList> = undefined!;
    defaultClause?: DefaultClause = undefined;
    endKeyword: MissableToken<EndKeywordToken> = undefined!;
    endSelectKeyword?: SelectKeywordToken = undefined;
}

export const CaseClauseChildNames: ReadonlyArray<keyof CaseClause> = [
    'caseKeyword',
    'expressions',
    'statements',
];

export class CaseClause extends Node {
    readonly kind = NodeKind.CaseClause;

    caseKeyword: CaseKeywordToken = undefined!;
    expressions: ParseContextElementDelimitedSequence<ParseContextKind.ExpressionSequence> = undefined!;
    statements: ParseContextElementArray<ParseContextKind.CaseClause> = undefined!;
}

export const DefaultClauseChildNames: ReadonlyArray<keyof DefaultClause> = [
    'defaultKeyword',
    'statements',
];

export class DefaultClause extends Node {
    readonly kind = NodeKind.DefaultClause;

    defaultKeyword: DefaultKeywordToken = undefined!;
    statements: ParseContextElementArray<ParseContextKind.DefaultClause> = undefined!;
}
