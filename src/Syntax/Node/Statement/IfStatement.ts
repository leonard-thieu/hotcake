import { MissableToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { ElseIfKeywordToken, ElseKeywordToken, EndIfKeywordToken, EndKeywordToken, IfKeywordToken, ThenKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { Node } from '../Node';
import { NodeKind } from '../NodeKind';
import { Statement, Statements } from './Statement';

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

export const ElseClauseChildNames: ReadonlyArray<keyof ElseClause> = [
    'elseKeyword',
    'statements',
];

export class ElseClause extends Node {
    readonly kind = NodeKind.ElseClause;

    elseKeyword: ElseKeywordToken = undefined!;
    statements: (Statements | SkippedToken)[] = undefined!;
}
