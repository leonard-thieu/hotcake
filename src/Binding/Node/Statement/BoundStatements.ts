import { BoundDataDeclarationStatement } from './BoundDataDeclarationStatement';
import { BoundExpressionStatement } from './BoundExpressionStatement';
import { BoundForLoop } from './BoundForLoop';
import { BoundElseIfStatement, BoundElseStatement, BoundIfStatement } from './BoundIfStatement';
import { BoundReturnStatement } from './BoundReturnStatement';
import { BoundCaseStatement, BoundDefaultStatement, BoundSelectStatement } from './BoundSelectStatement';

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
    BoundExpressionStatement
    ;
