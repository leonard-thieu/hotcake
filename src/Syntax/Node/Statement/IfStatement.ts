import { MissableToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { ElseIfKeywordToken, ElseKeywordToken, EndIfKeywordToken, EndKeywordToken, IfKeywordToken, ThenKeywordToken } from '../../Token/Tokens';
import { MissableExpression } from '../Expression/Expressions';
import { Node } from '../Nodes';
import { NodeKind } from '../Nodes';
import { Statement, Statements } from './Statements';

// #region If statement

export const IfStatementChildNames: ReadonlyArray<keyof IfStatement> = [
    'ifKeyword',
    'expression',
    'thenKeyword',
    'statements',
    'elseIfClauses',
    'elseClause',
    'endKeyword',
    'endIfKeyword',
    'terminator',
];

export class IfStatement extends Statement {
    readonly kind = NodeKind.IfStatement;

    ifKeyword: IfKeywordToken = undefined!;
    expression: MissableExpression = undefined!;
    thenKeyword?: ThenKeywordToken = undefined;
    statements: (Statements | SkippedToken)[] = undefined!;
    elseIfClauses?: ElseIfClause[] = undefined;
    elseClause?: ElseClause = undefined;
    endKeyword?: MissableToken<EndIfKeywordToken | EndKeywordToken> = undefined;
    endIfKeyword?: IfKeywordToken = undefined;
}

// #endregion

// #region Else if clause

export const ElseIfClauseChildNames: ReadonlyArray<keyof ElseIfClause> = [
    'elseIfKeyword',
    'ifKeyword',
    'expression',
    'thenKeyword',
    'statements',
];

export class ElseIfClause extends Node {
    readonly kind = NodeKind.ElseIfClause;

    elseIfKeyword: ElseIfKeywordToken | ElseKeywordToken = undefined!;
    ifKeyword?: IfKeywordToken = undefined;
    expression: MissableExpression = undefined!;
    thenKeyword?: ThenKeywordToken = undefined;
    statements: (Statements | SkippedToken)[] = undefined!;
}

// #endregion

// #region Else clause

export const ElseClauseChildNames: ReadonlyArray<keyof ElseClause> = [
    'elseKeyword',
    'statements',
];

export class ElseClause extends Node {
    readonly kind = NodeKind.ElseClause;

    elseKeyword: ElseKeywordToken = undefined!;
    statements: (Statements | SkippedToken)[] = undefined!;
}

// #endregion
