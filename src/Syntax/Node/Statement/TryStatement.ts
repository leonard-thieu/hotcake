import { ParseContextElementArray, ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { CatchKeywordToken, EndKeywordToken, TryKeywordToken } from '../../Token/Token';
import { MissableDataDeclaration } from '../Declaration/DataDeclarationSequence';
import { Node } from '../Node';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

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
    statements: ParseContextElementArray<ParseContextKind.TryStatement> = undefined!;
    catchClauses: ParseContextElementSequence<ParseContextKind.CatchClauseList> = undefined!;
    endKeyword: MissableToken<EndKeywordToken> = undefined!;
    endTryKeyword?: TryKeywordToken = undefined;
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
    statements: ParseContextElementArray<ParseContextKind.CatchClause> = undefined!;
}
