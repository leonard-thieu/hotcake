import { ParseContextElementArray, ParseContextElementDelimitedSequence, ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { CaseKeywordToken, DefaultKeywordToken, EndKeywordToken, ErrorableToken, SelectKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { isNode } from '../Node';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class SelectStatement extends Statement {
    static CHILD_NAMES: (keyof SelectStatement)[] = [
        'selectKeyword',
        'expression',
        'newlines',
        'caseStatements',
        'defaultStatement',
        'endKeyword',
        'endSelectKeyword',
        'terminator',
    ];

    readonly kind = NodeKind.SelectStatement;

    selectKeyword: SelectKeywordToken = undefined!;
    expression: MissableExpression = undefined!;
    newlines: ParseContextElementSequence<ParseContextKind.NewlineList> = undefined!;
    caseStatements: ParseContextElementSequence<ParseContextKind.CaseStatementList> = undefined!;
    defaultStatement?: DefaultStatement = undefined;
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

export class CaseStatement extends Statement {
    static CHILD_NAMES: (keyof CaseStatement)[] = [
        'caseKeyword',
        'expressions',
        'statements',
    ];

    readonly kind = NodeKind.CaseStatement;

    caseKeyword: CaseKeywordToken = undefined!;
    expressions: ParseContextElementDelimitedSequence<ParseContextKind.ExpressionSequence> = undefined!;
    statements: ParseContextElementArray<CaseStatement['kind']> = undefined!;

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

export class DefaultStatement extends Statement {
    static CHILD_NAMES: (keyof DefaultStatement)[] = [
        'defaultKeyword',
        'statements',
    ];

    readonly kind = NodeKind.DefaultStatement;

    defaultKeyword: DefaultKeywordToken = undefined!;
    statements: ParseContextElementArray<DefaultStatement['kind']> = undefined!;

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
