import { ParseContextElementArray } from '../../ParserBase';
import { MissableToken, MissingToken } from '../../Token/MissingToken';
import { EndKeywordToken, ForKeywordToken, NextKeywordToken, StepKeywordToken, ToKeywordToken, UntilKeywordToken } from '../../Token/Token';
import { TokenKind } from '../../Token/TokenKind';
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

    forKeyword: ForKeywordToken = undefined!;
    header: NumericForLoopHeader | DataDeclarationSequenceStatement | AssignmentExpression | MissingToken<TokenKind.ForLoopHeader> = undefined!;
    statements: ParseContextElementArray<ForLoop['kind']> = undefined!;
    endKeyword: MissableToken<NextKeywordToken | EndKeywordToken> = undefined!;
    endForKeyword?: ForKeywordToken = undefined;
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
}
