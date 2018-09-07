import { NewlineToken, SemicolonToken } from '../../Token/Token';
import { Node } from '../Node';
import { ContinueStatement } from './ContinueStatement';
import { EmptyStatement } from './EmptyStatement';
import { ExitStatement } from './ExitStatement';
import { ExpressionStatement } from './ExpressionStatement';
import { ForLoop } from './ForLoop';
import { ElseIfStatement, ElseStatement, IfStatement } from './IfStatement';
import { LocalDataDeclarationSequenceStatement } from './LocalDataDeclarationSequenceStatement';
import { RepeatLoop } from './RepeatLoop';
import { ReturnStatement } from './ReturnStatement';
import { CaseStatement, DefaultStatement, SelectStatement } from './SelectStatement';
import { ThrowStatement } from './ThrowStatement';
import { CatchStatement, TryStatement } from './TryStatement';
import { WhileLoop } from './WhileLoop';

export abstract class Statement extends Node {
    terminator: NewlineToken | SemicolonToken | null = null;
}

export type Statements =
    ContinueStatement |
    EmptyStatement |
    ExitStatement |
    ExpressionStatement |
    ForLoop |
    IfStatement | ElseIfStatement | ElseStatement |
    LocalDataDeclarationSequenceStatement |
    RepeatLoop |
    ReturnStatement |
    SelectStatement | CaseStatement | DefaultStatement |
    ThrowStatement |
    TryStatement | CatchStatement |
    WhileLoop
    ;
