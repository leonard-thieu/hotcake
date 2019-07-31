import { MissableToken, MissingToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { EndKeywordToken, ForKeywordToken, NextKeywordToken, StepKeywordToken, ToKeywordToken, UntilKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { Node } from '../Node';
import { NodeKind } from '../NodeKind';
import { AssignmentStatement } from './AssignmentStatement';
import { DataDeclarationSequenceStatement } from './DataDeclarationSequenceStatement';
import { Statement, Statements } from './Statement';

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
    header: NumericForLoopHeader | DataDeclarationSequenceStatement | AssignmentStatement | MissingToken = undefined!;
    statements: (Statements | SkippedToken)[] = undefined!;
    endKeyword: MissableToken<NextKeywordToken | EndKeywordToken> = undefined!;
    endForKeyword?: ForKeywordToken = undefined;
}

export const NumericForLoopHeaderChildNames: ReadonlyArray<keyof NumericForLoopHeader> = [
    'loopVariableStatement',
    'toOrUntilKeyword',
    'lastValueExpression',
    'stepKeyword',
    'stepValueExpression',
];

export class NumericForLoopHeader extends Node {
    readonly kind = NodeKind.NumericForLoopHeader;

    loopVariableStatement: DataDeclarationSequenceStatement | AssignmentStatement = undefined!;
    toOrUntilKeyword: MissableToken<ToKeywordToken | UntilKeywordToken> = undefined!;
    lastValueExpression: MissableExpression = undefined!;
    stepKeyword?: StepKeywordToken = undefined;
    stepValueExpression?: MissableExpression = undefined;
}
