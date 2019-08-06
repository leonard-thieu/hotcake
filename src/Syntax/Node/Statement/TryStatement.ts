import { MissableToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { CatchKeywordToken, EndKeywordToken, TryKeywordToken } from '../../Token/Tokens';
import { MissableDataDeclaration } from '../Declaration/DataDeclarationSequence';
import { Node } from '../Nodes';
import { NodeKind } from '../Nodes';
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
    endKeyword: MissableToken<EndKeywordToken> = undefined!;
    endTryKeyword?: TryKeywordToken = undefined;
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
    parameter: MissableDataDeclaration = undefined!;
    statements: (Statements | SkippedToken)[] = undefined!;
}

// #endregion
