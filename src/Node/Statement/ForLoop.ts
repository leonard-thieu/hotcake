import { ParseContextElementArray } from '../../ParserBase';
import { EndKeywordToken, ForKeywordToken, MissingExpressionToken, NextKeywordToken, StepKeywordToken, ToKeywordToken, UntilKeywordToken } from '../../Token/Token';
import { AssignmentExpression } from '../Expression/AssignmentExpression';
import { Expressions } from '../Expression/Expression';
import { Node } from '../Node';
import { NodeKind } from '../NodeKind';
import { LocalDeclarationListStatement } from './LocalDeclarationListStatement';
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
    header: NumericForLoopHeader | LocalDeclarationListStatement | AssignmentExpression;
    statements: ParseContextElementArray<ForLoop['kind']>;
    endKeyword: NextKeywordToken | EndKeywordToken;
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

    loopVariableExpression: LocalDeclarationListStatement | AssignmentExpression;
    toOrUntilKeyword: ToKeywordToken | UntilKeywordToken;
    lastValueExpression: Expressions | MissingExpressionToken;
    stepKeyword: StepKeywordToken | null = null;
    stepValueExpression: Expressions | MissingExpressionToken | null = null;
}
