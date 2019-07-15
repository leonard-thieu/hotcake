import { ParseContextElementArray, ParseContextElementDelimitedSequence, ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { CaseKeywordToken, DefaultKeywordToken, EndKeywordToken, ErrorableToken, SelectKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { isNode, Node } from '../Node';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class SelectStatement extends Statement {
    static CHILD_NAMES: (keyof SelectStatement)[] = [
        'selectKeyword',
        'expression',
        'newlines',
        'caseClauses',
        'defaultClause',
        'endKeyword',
        'endSelectKeyword',
        'terminator',
    ];

    readonly kind = NodeKind.SelectStatement;

    selectKeyword: SelectKeywordToken = undefined!;
    expression: MissableExpression = undefined!;
    newlines: ParseContextElementSequence<ParseContextKind.NewlineList> = undefined!;
    caseClauses: ParseContextElementSequence<ParseContextKind.CaseClauseList> = undefined!;
    defaultClause?: DefaultClause = undefined;
    endKeyword: MissableToken<EndKeywordToken> = undefined!;
    endSelectKeyword?: SelectKeywordToken = undefined;

    get firstToken() {
        return this.selectKeyword;
    }

    get lastToken() {
        if (this.terminator) {
            return this.terminator;
        }

        if (this.endSelectKeyword) {
            return this.endSelectKeyword;
        }

        return this.endKeyword;
    }
}

export class CaseClause extends Node {
    static CHILD_NAMES: (keyof CaseClause)[] = [
        'caseKeyword',
        'expressions',
        'statements',
    ];

    readonly kind = NodeKind.CaseClause;

    caseKeyword: CaseKeywordToken = undefined!;
    expressions: ParseContextElementDelimitedSequence<ParseContextKind.ExpressionSequence> = undefined!;
    statements: ParseContextElementArray<CaseClause['kind']> = undefined!;

    get firstToken() {
        return this.caseKeyword;
    }

    get lastToken(): ErrorableToken {
        if (this.statements.length !== 0) {
            const lastStatement = this.statements[this.statements.length - 1];
            if (isNode(lastStatement)) {
                return lastStatement.lastToken;
            }

            return lastStatement;
        }

        // TODO: `parseList` should guarantee an expression.
        if (this.expressions.length !== 0) {
            const lastExpression = this.expressions[this.expressions.length - 1];
            if (isNode(lastExpression)) {
                return lastExpression.lastToken;
            }

            return lastExpression;
        }

        return this.caseKeyword;
    }
}

export class DefaultClause extends Node {
    static CHILD_NAMES: (keyof DefaultClause)[] = [
        'defaultKeyword',
        'statements',
    ];

    readonly kind = NodeKind.DefaultClause;

    defaultKeyword: DefaultKeywordToken = undefined!;
    statements: ParseContextElementArray<DefaultClause['kind']> = undefined!;

    get firstToken() {
        return this.defaultKeyword;
    }

    get lastToken(): ErrorableToken {
        if (this.statements.length !== 0) {
            const lastStatement = this.statements[this.statements.length - 1];
            if (isNode(lastStatement)) {
                return lastStatement.lastToken;
            }

            return lastStatement;
        }

        return this.defaultKeyword;
    }
}
