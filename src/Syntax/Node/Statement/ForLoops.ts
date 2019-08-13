import { MissingToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { ColonEqualsSignToken, EachInKeywordToken, EndKeywordToken, EqualsSignToken, ForKeywordToken, LocalKeywordToken, NextKeywordToken, StepKeywordToken, ToKeywordToken, UntilKeywordToken } from '../../Token/Tokens';
import { Expressions } from '../Expression/Expressions';
import { Identifier } from '../Identifier';
import { NodeKind } from '../Nodes';
import { TypeAnnotation } from '../TypeAnnotation';
import { AssignmentOperatorToken } from './AssignmentStatement';
import { Statement, Statements } from './Statements';

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
    localKeyword?: LocalKeywordToken = undefined!;
    indexVariable: Identifier | MissingToken = undefined!;
    typeAnnotation?: TypeAnnotation = undefined!;
    operator: ForLoopOperatorToken = undefined!;
    firstValueExpression: Expressions | MissingToken = undefined!;
    toOrUntilKeyword: ToKeywordToken | UntilKeywordToken | MissingToken = undefined!;
    lastValueExpression: Expressions | MissingToken = undefined!;
    stepKeyword?: StepKeywordToken = undefined!;
    stepValueExpression?: Expressions | MissingToken = undefined!;
    statements: (Statements | SkippedToken)[] = undefined!;
    endKeyword: NextKeywordToken | EndKeywordToken | MissingToken = undefined!;
    endForKeyword?: ForKeywordToken = undefined!;
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
    localKeyword?: LocalKeywordToken = undefined!;
    indexVariable: Identifier | MissingToken = undefined!;
    typeAnnotation?: TypeAnnotation = undefined!;
    operator: ForLoopOperatorToken = undefined!;
    eachInKeyword: EachInKeywordToken = undefined!;
    collectionExpression: Expressions | MissingToken = undefined!;
    statements: (Statements | SkippedToken)[] = undefined!;
    endKeyword: NextKeywordToken | EndKeywordToken | MissingToken = undefined!;
    endForKeyword?: ForKeywordToken = undefined!;
}

// #endregion

export type ForLoopOperatorToken =
    | EqualsSignToken | ColonEqualsSignToken
    | AssignmentOperatorToken
    | MissingToken
    ;
