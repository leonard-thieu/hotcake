import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { MissableToken, MissingToken } from '../../Token/MissingToken';
import { EndKeywordToken, ForKeywordToken, NextKeywordToken, StepKeywordToken, ToKeywordToken, UntilKeywordToken } from '../../Token/Token';
import { AssignmentExpression } from '../Expression/AssignmentExpression';
import { MissableExpression } from '../Expression/Expression';
import { Node } from '../Node';
import { NodeKind } from '../NodeKind';
import { DataDeclarationSequenceStatement } from './DataDeclarationSequenceStatement';
import { Statement } from './Statement';

export const ForLoopChildNames: ReadonlyArray<keyof ForLoop> = [
    'forKeyword',
    'header',
    'statements',
    'endKeyword',
    'endForKeyword',
    'terminator',
];

export class ForLoop extends Statement {
    readonly kind = NodeKind.ForLoop;

    forKeyword: ForKeywordToken = undefined!;
    header: NumericForLoopHeader | DataDeclarationSequenceStatement | AssignmentExpression | MissingToken = undefined!;
    statements: ParseContextElementArray<ParseContextKind.ForLoop> = undefined!;
    endKeyword: MissableToken<NextKeywordToken | EndKeywordToken> = undefined!;
    endForKeyword?: ForKeywordToken = undefined;
}

export const NumericForLoopHeaderChildNames: ReadonlyArray<keyof NumericForLoopHeader> = [
    'loopVariableExpression',
    'toOrUntilKeyword',
    'lastValueExpression',
    'stepKeyword',
    'stepValueExpression',
];

export class NumericForLoopHeader extends Node {
    readonly kind = NodeKind.NumericForLoopHeader;

    loopVariableExpression: DataDeclarationSequenceStatement | AssignmentExpression = undefined!;
    toOrUntilKeyword: MissableToken<ToKeywordToken | UntilKeywordToken> = undefined!;
    lastValueExpression: MissableExpression = undefined!;
    stepKeyword?: StepKeywordToken = undefined;
    stepValueExpression?: MissableExpression = undefined;
}
