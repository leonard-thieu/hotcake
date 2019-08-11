import { MissableToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { CaseKeywordToken, DefaultKeywordToken, EndKeywordToken, NewlineToken, SelectKeywordToken } from '../../Token/Tokens';
import { CommaSeparator } from '../CommaSeparator';
import { MissableExpression } from '../Expression/Expressions';
import { Node } from '../Nodes';
import { NodeKind } from '../Nodes';
import { Statement, Statements } from './Statements';

// #region Select statement

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
    newlines: NewlineToken[] = undefined!;
    caseClauses: CaseClause[] = undefined!;
    defaultClause?: DefaultClause = undefined;
    endKeyword: MissableToken<EndKeywordToken> = undefined!;
    endSelectKeyword?: SelectKeywordToken = undefined;
}

// #endregion

// #region Case clause

export const CaseClauseChildNames: ReadonlyArray<keyof CaseClause> = [
    'caseKeyword',
    'expressions',
    'statements',
];

export class CaseClause extends Node {
    readonly kind = NodeKind.CaseClause;

    caseKeyword: CaseKeywordToken = undefined!;
    expressions: (MissableExpression | CommaSeparator)[] = undefined!;
    statements: (Statements | SkippedToken)[] = undefined!;
}

// #endregion

// #region Default clause

export const DefaultClauseChildNames: ReadonlyArray<keyof DefaultClause> = [
    'defaultKeyword',
    'statements',
];

export class DefaultClause extends Node {
    readonly kind = NodeKind.DefaultClause;

    defaultKeyword: DefaultKeywordToken = undefined!;
    statements: (Statements | SkippedToken)[] = undefined!;
}

// #endregion
