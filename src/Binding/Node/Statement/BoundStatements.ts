import { BoundDataDeclarationStatement } from './BoundDataDeclarationStatement';
import { BoundExpressionStatement } from './BoundExpressionStatement';
import { BoundForLoop } from './BoundForLoop';
import { BoundElseIfStatement, BoundElseStatement, BoundIfStatement } from './BoundIfStatement';
import { BoundRepeatLoop } from './BoundRepeatLoop';
import { BoundReturnStatement } from './BoundReturnStatement';
import { BoundCaseStatement, BoundDefaultStatement, BoundSelectStatement } from './BoundSelectStatement';
import { BoundThrowStatement } from './BoundThrowStatement';
import { BoundCatchStatement, BoundTryStatement } from './BoundTryStatement';
import { BoundWhileLoop } from "./BoundWhileLoop";

export type BoundStatements =
    BoundDataDeclarationStatement |
    BoundIfStatement |
    BoundElseIfStatement |
    BoundElseStatement |
    BoundSelectStatement |
    BoundCaseStatement |
    BoundDefaultStatement |
    BoundReturnStatement |
    BoundForLoop |
    BoundWhileLoop |
    BoundRepeatLoop |
    BoundTryStatement |
    BoundCatchStatement |
    BoundThrowStatement |
    BoundExpressionStatement
    ;
