import { MissableToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { ColonEqualsSignToken, EachInKeywordToken, EndKeywordToken, EqualsSignToken, ForKeywordToken, LocalKeywordToken, NextKeywordToken, StepKeywordToken, ToKeywordToken, UntilKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { MissableIdentifier } from '../Identifier';
import { NodeKind } from '../NodeKind';
import { TypeAnnotation } from '../TypeAnnotation';
import { AssignmentOperatorToken } from './AssignmentStatement';
import { Statement, Statements } from './Statement';

// #region Numeric for loop

export const NumericForLoopChildNames: ReadonlyArray<keyof NumericForLoop> = [
    'forKeyword',
    'localKeyword',
    'indexVariable',
    'typeAnnotation',
    'operator',
    'firstValueExpression',
    'toOrUntilKeyword',
    'lastValueExpression',
    'stepKeyword',
    'stepValueExpression',
    'statements',
    'endKeyword',
    'endForKeyword',
    'terminator',
];

export class NumericForLoop extends Statement {
    readonly kind = NodeKind.NumericForLoop;

    forKeyword: ForKeywordToken = undefined!;
    localKeyword?: LocalKeywordToken = undefined;
    indexVariable: MissableIdentifier = undefined!;
    typeAnnotation?: TypeAnnotation = undefined;
    operator: ForLoopOperatorToken = undefined!;
    firstValueExpression: MissableExpression = undefined!;
    toOrUntilKeyword: MissableToken<ToKeywordToken | UntilKeywordToken> = undefined!;
    lastValueExpression: MissableExpression = undefined!;
    stepKeyword?: StepKeywordToken = undefined;
    stepValueExpression?: MissableExpression = undefined;
    statements: (Statements | SkippedToken)[] = undefined!;
    endKeyword: MissableToken<NextKeywordToken | EndKeywordToken> = undefined!;
    endForKeyword?: ForKeywordToken = undefined;
}

// #endregion

// #region For EachIn loop

export const ForEachInLoopChildNames: ReadonlyArray<keyof ForEachInLoop> = [
    'forKeyword',
    'localKeyword',
    'indexVariable',
    'typeAnnotation',
    'operator',
    'eachInKeyword',
    'collectionExpression',
    'statements',
    'endKeyword',
    'endForKeyword',
    'terminator',
];

export class ForEachInLoop extends Statement {
    readonly kind = NodeKind.ForEachInLoop;

    forKeyword: ForKeywordToken = undefined!;
    localKeyword?: LocalKeywordToken = undefined;
    indexVariable: MissableIdentifier = undefined!;
    typeAnnotation?: TypeAnnotation = undefined;
    operator: ForLoopOperatorToken = undefined!;
    eachInKeyword: EachInKeywordToken = undefined!;
    collectionExpression: MissableExpression = undefined!;
    statements: (Statements | SkippedToken)[] = undefined!;
    endKeyword: MissableToken<NextKeywordToken | EndKeywordToken> = undefined!;
    endForKeyword?: ForKeywordToken = undefined;
}

// #endregion

export type ForLoopOperatorToken =
    | MissableToken<EqualsSignToken | ColonEqualsSignToken>
    | MissableToken<AssignmentOperatorToken>
    ;
