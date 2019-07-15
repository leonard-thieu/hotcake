import { ParseContextElementArray, ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { CatchKeywordToken, EndKeywordToken, TryKeywordToken } from '../../Token/Token';
import { MissableDataDeclaration } from '../Declaration/DataDeclarationSequence';
import { isNode, Node } from '../Node';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class TryStatement extends Statement {
    static CHILD_NAMES: (keyof TryStatement)[] = [
        'tryKeyword',
        'statements',
        'catchClauses',
        'endKeyword',
        'endTryKeyword',
        'terminator',
    ];

    readonly kind = NodeKind.TryStatement;

    tryKeyword: TryKeywordToken = undefined!;
    statements: ParseContextElementArray<TryStatement['kind']> = undefined!;
    catchClauses: ParseContextElementSequence<ParseContextKind.CatchClauseList> = undefined!;
    endKeyword: MissableToken<EndKeywordToken> = undefined!;
    endTryKeyword?: TryKeywordToken = undefined;

    get firstToken() {
        return this.tryKeyword;
    }

    get lastToken() {
        if (this.terminator) {
            return this.terminator;
        }

        if (this.endTryKeyword) {
            return this.endTryKeyword;
        }

        return this.endKeyword;
    }
}

export class CatchClause extends Node {
    static CHILD_NAMES: (keyof CatchClause)[] = [
        'catchKeyword',
        'parameter',
        'statements',
    ];

    readonly kind = NodeKind.CatchClause;

    catchKeyword: CatchKeywordToken = undefined!;
    parameter: MissableDataDeclaration = undefined!;
    statements: ParseContextElementArray<CatchClause['kind']> = undefined!;

    get firstToken() {
        return this.catchKeyword;
    }

    get lastToken() {
        if (this.statements.length !== 0) {
            const lastStatement = this.statements[this.statements.length - 1];
            if (isNode(lastStatement)) {
                return lastStatement.lastToken;
            }

            return lastStatement;
        }

        if (isNode(this.parameter)) {
            return this.parameter.lastToken;
        }

        return this.parameter;
    }
}
