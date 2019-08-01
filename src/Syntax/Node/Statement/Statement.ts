import { NewlineToken, SemicolonToken } from '../../Token/Token';
import { Node } from '../Node';
import { AssignmentStatement } from './AssignmentStatement';
import { ContinueStatement } from './ContinueStatement';
import { DataDeclarationSequenceStatement } from './DataDeclarationSequenceStatement';
import { EmptyStatement } from './EmptyStatement';
import { ExitStatement } from './ExitStatement';
import { ExpressionStatement } from './ExpressionStatement';
import { ForEachInLoop, NumericForLoop } from './ForLoop';
import { IfStatement } from './IfStatement';
import { RepeatLoop } from './RepeatLoop';
import { ReturnStatement } from './ReturnStatement';
import { SelectStatement } from './SelectStatement';
import { ThrowStatement } from './ThrowStatement';
import { TryStatement } from './TryStatement';
import { WhileLoop } from './WhileLoop';

export abstract class Statement extends Node {
    terminator?: NewlineToken | SemicolonToken;
}

export type Statements =
    | DataDeclarationSequenceStatement
    | ReturnStatement
    | IfStatement
    | SelectStatement
    | WhileLoop
    | RepeatLoop
    | NumericForLoop
    | ForEachInLoop
    | ContinueStatement
    | ExitStatement
    | ThrowStatement
    | TryStatement
    | AssignmentStatement
    | ExpressionStatement
    | EmptyStatement
    ;
