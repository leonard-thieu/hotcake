import { ClassMethodDeclaration } from '../Declaration/ClassMethodDeclaration';
import { FunctionDeclaration } from '../Declaration/FunctionDeclaration';
import { ForLoop } from './ForLoop';
import { ElseIfStatement, ElseStatement, IfStatement } from './IfStatement';
import { RepeatLoop } from './RepeatLoop';
import { CaseStatement, DefaultStatement } from './SelectStatement';
import { CatchStatement, TryStatement } from './TryStatement';
import { WhileLoop } from './WhileLoop';

export type StatementsParent =
    FunctionDeclaration |
    ClassMethodDeclaration |
    IfStatement |
    ElseIfStatement |
    ElseStatement |
    CaseStatement |
    DefaultStatement |
    WhileLoop |
    RepeatLoop |
    ForLoop |
    TryStatement |
    CatchStatement
    ;
