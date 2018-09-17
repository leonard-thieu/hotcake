import { ParseContextElementArray } from '../../ParserBase';
import { MissableToken, MissingToken } from '../../Token/MissingToken';
import { EndKeywordToken, ForKeywordToken, NextKeywordToken, StepKeywordToken, ToKeywordToken, UntilKeywordToken } from '../../Token/Token';
import { TokenKind } from '../../Token/TokenKind';
import { AssignmentExpression } from '../Expression/AssignmentExpression';
import { MissableExpression } from '../Expression/Expression';
import { isNode, Node } from '../Node';
import { NodeKind } from '../NodeKind';
import { DataDeclarationSequenceStatement } from './DataDeclarationSequenceStatement';
import { Statement } from './Statement';

export class ForLoop extends Statement {
    static CHILD_NAMES: (keyof ForLoop)[] = [
        'forKeyword',
        'header',
        'statements',
        'endKeyword',
        'endForKeyword',
        'terminator',
    ];

    readonly kind = NodeKind.ForLoop;

    forKeyword: ForKeywordToken = undefined!;
    header: NumericForLoopHeader | DataDeclarationSequenceStatement | AssignmentExpression | MissingToken<TokenKind.ForLoopHeader> = undefined!;
    statements: ParseContextElementArray<ForLoop['kind']> = undefined!;
    endKeyword: MissableToken<NextKeywordToken | EndKeywordToken> = undefined!;
    endForKeyword?: ForKeywordToken = undefined;

    get firstToken() {
        return this.forKeyword;
    }

    get lastToken() {
        if (this.terminator) {
            return this.terminator;
        }
        
        if (this.endForKeyword) {
            return this.endForKeyword;
        }

        return this.endKeyword;
    }
}

export class NumericForLoopHeader extends Node {
    static CHILD_NAMES: (keyof NumericForLoopHeader)[] = [
        'loopVariableExpression',
        'toOrUntilKeyword',
        'lastValueExpression',
        'stepKeyword',
        'stepValueExpression',
    ];

    readonly kind = NodeKind.NumericForLoopHeader;

    loopVariableExpression: DataDeclarationSequenceStatement | AssignmentExpression = undefined!;
    toOrUntilKeyword: MissableToken<ToKeywordToken | UntilKeywordToken> = undefined!;
    lastValueExpression: MissableExpression = undefined!;
    stepKeyword?: StepKeywordToken = undefined;
    stepValueExpression?: MissableExpression = undefined;

    get firstToken() {
        return this.loopVariableExpression.firstToken;
    }

    get lastToken() {
        if (this.stepValueExpression) {
            if (isNode(this.stepValueExpression)) {
                return this.stepValueExpression.lastToken;
            }

            return this.stepValueExpression;
        }

        if (isNode(this.lastValueExpression)) {
            return this.lastValueExpression.lastToken;
        }

        return this.lastValueExpression;
    }
}
