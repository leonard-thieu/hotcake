import { BoundSymbolTable } from '../../../Binding/BoundSymbol';
import { MissableToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { CatchKeywordToken, EndKeywordToken, TryKeywordToken } from '../../Token/Token';
import { MissableDataDeclaration } from '../Declaration/DataDeclarationSequence';
import { Node } from '../Node';
import { NodeKind } from '../NodeKind';
import { Statement, Statements } from './Statement';

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

    locals = new BoundSymbolTable();
}

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

    locals = new BoundSymbolTable();
}
