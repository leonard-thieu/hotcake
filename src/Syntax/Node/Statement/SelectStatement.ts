import { ParseContextElementArray, ParseContextElementDelimitedSequence, ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { CaseKeywordToken, DefaultKeywordToken, EndKeywordToken, SelectKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { Node } from '../Node';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

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

export class CaseClause extends Node {
    readonly kind = NodeKind.CaseClause;

    caseKeyword: CaseKeywordToken = undefined!;
    expressions: ParseContextElementDelimitedSequence<ParseContextKind.ExpressionSequence> = undefined!;
    statements: ParseContextElementArray<CaseClause['kind']> = undefined!;
}

export class DefaultClause extends Node {
    readonly kind = NodeKind.DefaultClause;

    defaultKeyword: DefaultKeywordToken = undefined!;
    statements: ParseContextElementArray<DefaultClause['kind']> = undefined!;
}
