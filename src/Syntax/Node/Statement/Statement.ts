import { NewlineToken, SemicolonToken } from '../../Token/Token';
import { Node } from '../Node';
import { ContinueStatement } from './ContinueStatement';
import { DataDeclarationSequenceStatement } from './DataDeclarationSequenceStatement';
import { EmptyStatement } from './EmptyStatement';
import { ExitStatement } from './ExitStatement';
import { ExpressionStatement } from './ExpressionStatement';
import { ForLoop } from './ForLoop';
import { IfStatement } from './IfStatement';
import { RepeatLoop } from './RepeatLoop';
import { ReturnStatement } from './ReturnStatement';
import { CaseStatement, DefaultStatement, SelectStatement } from './SelectStatement';
import { ThrowStatement } from './ThrowStatement';
import { CatchStatement, TryStatement } from './TryStatement';
import { WhileLoop } from './WhileLoop';

export abstract class Statement extends Node {
    terminator?: NewlineToken | SemicolonToken = undefined;
}

export type Statements =
    ContinueStatement |
    DataDeclarationSequenceStatement |
    EmptyStatement |
    ExitStatement |
    ExpressionStatement |
    ForLoop |
    IfStatement |
    RepeatLoop |
    ReturnStatement |
    SelectStatement | CaseStatement | DefaultStatement |
    ThrowStatement |
    TryStatement | CatchStatement |
    WhileLoop
    ;
