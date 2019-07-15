import { BoundContinueStatement } from './BoundContinueStatement';
import { BoundDataDeclarationStatement } from './BoundDataDeclarationStatement';
import { BoundExitStatement } from './BoundExitStatement';
import { BoundExpressionStatement } from './BoundExpressionStatement';
import { BoundForLoop } from './BoundForLoop';
import { BoundIfStatement } from './BoundIfStatement';
import { BoundRepeatLoop } from './BoundRepeatLoop';
import { BoundReturnStatement } from './BoundReturnStatement';
import { BoundCaseStatement, BoundDefaultStatement, BoundSelectStatement } from './BoundSelectStatement';
import { BoundThrowStatement } from './BoundThrowStatement';
import { BoundCatchStatement, BoundTryStatement } from './BoundTryStatement';
import { BoundWhileLoop } from "./BoundWhileLoop";

export type BoundStatements =
    BoundDataDeclarationStatement |
    BoundIfStatement |
    BoundSelectStatement |
    BoundCaseStatement |
    BoundDefaultStatement |
    BoundReturnStatement |
    BoundForLoop |
    BoundWhileLoop |
    BoundRepeatLoop |
    BoundContinueStatement |
    BoundExitStatement |
    BoundTryStatement |
    BoundCatchStatement |
    BoundThrowStatement |
    BoundExpressionStatement
    ;
