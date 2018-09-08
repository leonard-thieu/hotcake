import { ParseContextElementArray } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { EndKeywordToken, ForKeywordToken, NextKeywordToken, StepKeywordToken, ToKeywordToken, UntilKeywordToken } from '../../Token/Token';
import { AssignmentExpression } from '../Expression/AssignmentExpression';
import { MissableExpression } from '../Expression/Expression';
import { Node } from '../Node';
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

    forKeyword: ForKeywordToken;
    header: NumericForLoopHeader | DataDeclarationSequenceStatement | AssignmentExpression;
    statements: ParseContextElementArray<ForLoop['kind']>;
    endKeyword: MissableToken<NextKeywordToken | EndKeywordToken>;
    endForKeyword: ForKeywordToken | null = null;
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

    loopVariableExpression: DataDeclarationSequenceStatement | AssignmentExpression;
    toOrUntilKeyword: MissableToken<ToKeywordToken | UntilKeywordToken>;
    lastValueExpression: MissableExpression;
    stepKeyword: StepKeywordToken | null = null;
    stepValueExpression: MissableExpression | null = null;
}
