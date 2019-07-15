import { ParseContextElementArray, ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { ElseIfKeywordToken, ElseKeywordToken, EndIfKeywordToken, EndKeywordToken, ErrorableToken, IfKeywordToken, ThenKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { isNode, Node } from '../Node';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class IfStatement extends Statement {
    static CHILD_NAMES: (keyof IfStatement)[] = [
        'ifKeyword',
        'expression',
        'thenKeyword',
        'isSingleLine',
        'statements',
        'elseIfClauses',
        'elseClause',
        'endKeyword',
        'endIfKeyword',
        'terminator',
    ];

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

    get firstToken() {
        return this.ifKeyword;
    }

    get lastToken(): ErrorableToken {
        if (this.terminator) {
            return this.terminator;
        }

        if (this.isSingleLine) {
            if (this.elseClause) {
                return this.elseClause.lastToken;
            }

            // TODO: `parseList` should guarantee a statement for single line If statements.
            if (this.statements.length !== 0) {
                const lastStatement = this.statements[this.statements.length - 1];
                if (isNode(lastStatement)) {
                    return lastStatement.lastToken;
                }

                return lastStatement;
            }

            if (this.thenKeyword) {
                return this.thenKeyword;
            }

            if (isNode(this.expression)) {
                return this.expression.lastToken;
            }

            return this.expression;
        }

        if (this.endIfKeyword) {
            return this.endIfKeyword;
        }

        return this.endKeyword!;
    }
}

export class ElseIfClause extends Node {
    static CHILD_NAMES: (keyof ElseIfClause)[] = [
        'elseIfKeyword',
        'ifKeyword',
        'expression',
        'thenKeyword',
        'statements',
    ];

    readonly kind = NodeKind.ElseIfClause;

    elseIfKeyword: ElseIfKeywordToken | ElseKeywordToken = undefined!;
    ifKeyword?: IfKeywordToken = undefined;
    expression: MissableExpression = undefined!;
    thenKeyword?: ThenKeywordToken = undefined;
    statements: ParseContextElementArray<ElseIfClause['kind']> = undefined!;

    get firstToken() {
        return this.elseIfKeyword;
    }

    get lastToken(): ErrorableToken {
        if (this.statements.length !== 0) {
            const lastStatement = this.statements[this.statements.length - 1];
            if (isNode(lastStatement)) {
                return lastStatement.lastToken;
            }

            return lastStatement;
        }

        if (this.thenKeyword) {
            return this.thenKeyword;
        }

        if (isNode(this.expression)) {
            return this.expression.lastToken;
        }

        return this.expression;
    }
}

export class ElseClause extends Node {
    static CHILD_NAMES: (keyof ElseClause)[] = [
        'elseKeyword',
        'statements',
    ];

    readonly kind = NodeKind.ElseClause;

    elseKeyword: ElseKeywordToken = undefined!;
    statements: ParseContextElementArray<ElseClause['kind']> = undefined!;

    get firstToken() {
        return this.elseKeyword;
    }

    get lastToken() {
        if (this.statements.length !== 0) {
            const lastStatement = this.statements[this.statements.length - 1];
            if (isNode(lastStatement)) {
                return lastStatement.lastToken;
            }

            return lastStatement;
        }

        return this.elseKeyword;
    }

    get isSingleLine() {
        if (this.parent && this.parent.kind === NodeKind.IfStatement) {
            return this.parent.isSingleLine;
        }

        return false;
    }
}
