import { ParseContextElementArray, ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { ElseIfKeywordToken, ElseKeywordToken, EndIfKeywordToken, EndKeywordToken, IfKeywordToken, ThenKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { Node } from '../Node';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

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
    isSingleLine: boolean = false;
    statements: ParseContextElementArray<IfStatement['kind']> = undefined!;
    elseIfClauses?: ParseContextElementSequence<ParseContextKind.ElseIfClauseList> = undefined;
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
    statements: ParseContextElementArray<ElseIfClause['kind']> = undefined!;
}

export const ElseClauseChildNames: ReadonlyArray<keyof ElseClause> = [
    'elseKeyword',
    'statements',
];

export class ElseClause extends Node {
    readonly kind = NodeKind.ElseClause;

    elseKeyword: ElseKeywordToken = undefined!;
    statements: ParseContextElementArray<ElseClause['kind']> = undefined!;

    get isSingleLine() {
        if (this.parent && this.parent.kind === NodeKind.IfStatement) {
            return this.parent.isSingleLine;
        }

        return false;
    }
}
