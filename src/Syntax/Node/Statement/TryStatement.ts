import { MissingToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { CatchKeywordToken, EndKeywordToken, TryKeywordToken } from '../../Token/Tokens';
import { DataDeclaration } from '../Declaration/DataDeclarationSequence';
import { Node, NodeKind } from '../Nodes';
import { Statement, Statements } from './Statements';

// #region Try statement

export const TryStatementChildNames: ReadonlyArray<keyof TryStatement> = [
    'tryKeyword',
    'statements',
    'catchClauses',
    'endKeyword',
    'endTryKeyword',
    'terminator',
];

export class TryStatement extends Statement {
    readonly kind = NodeKind.TryStatement;

    tryKeyword: TryKeywordToken = undefined!;
    statements: (Statements | SkippedToken)[] = undefined!;
    catchClauses: CatchClause[] = undefined!;
    endKeyword: EndKeywordToken | MissingToken = undefined!;
    endTryKeyword?: TryKeywordToken = undefined!;
}

// #endregion

// #region Catch clause

export const CatchClauseChildNames: ReadonlyArray<keyof CatchClause> = [
    'catchKeyword',
    'parameter',
    'statements',
];

export class CatchClause extends Node {
    readonly kind = NodeKind.CatchClause;

    catchKeyword: CatchKeywordToken = undefined!;
    parameter: DataDeclaration | MissingToken = undefined!;
    statements: (Statements | SkippedToken)[] = undefined!;
}

// #endregion
