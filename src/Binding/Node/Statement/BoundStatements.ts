import { BoundAssignmentStatement } from './BoundAssignmentStatement';
import { BoundContinueStatement } from './BoundContinueStatement';
import { BoundDataDeclarationStatement } from './BoundDataDeclarationStatement';
import { BoundExitStatement } from './BoundExitStatement';
import { BoundExpressionStatement } from './BoundExpressionStatement';
import { BoundForLoop } from './BoundForLoop';
import { BoundIfStatement } from './BoundIfStatement';
import { BoundRepeatLoop } from './BoundRepeatLoop';
import { BoundReturnStatement } from './BoundReturnStatement';
import { BoundSelectStatement } from './BoundSelectStatement';
import { BoundThrowStatement } from './BoundThrowStatement';
import { BoundTryStatement } from './BoundTryStatement';
import { BoundWhileLoop } from "./BoundWhileLoop";

export type BoundStatements =
    | BoundDataDeclarationStatement
    | BoundReturnStatement
    | BoundIfStatement
    | BoundSelectStatement
    | BoundWhileLoop
    | BoundRepeatLoop
    | BoundForLoop
    | BoundContinueStatement
    | BoundExitStatement
    | BoundThrowStatement
    | BoundTryStatement
    | BoundAssignmentStatement
    | BoundExpressionStatement
    ;
