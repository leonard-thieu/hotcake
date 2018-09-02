import { ParseContextElementArray } from '../../ParserBase';
import { EndKeywordToken, ForKeywordToken, MissingExpressionToken, NextKeywordToken, StepKeywordToken, ToKeywordToken, UntilKeywordToken } from '../../Token/Token';
import { BinaryExpression } from '../Expression/BinaryExpression';
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
    header: NumericForLoopHeader | LocalDeclarationListStatement | BinaryExpression;
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

    loopVariableExpression: LocalDeclarationListStatement | BinaryExpression;
    toOrUntilKeyword: ToKeywordToken | UntilKeywordToken;
    lastValueExpression: Expressions | MissingExpressionToken;
    stepKeyword: StepKeywordToken | null = null;
    stepValueExpression: Expressions | MissingExpressionToken | null = null;
}
