import { BoundDataDeclarationStatement } from './BoundDataDeclarationStatement';
import { BoundExpressionStatement } from './BoundExpressionStatement';
import { BoundElseIfStatement, BoundElseStatement, BoundIfStatement } from './BoundIfStatement';
import { BoundReturnStatement } from './BoundReturnStatement';

export type BoundStatements =
    BoundDataDeclarationStatement |
    BoundIfStatement |
    BoundElseIfStatement |
    BoundElseStatement |
    BoundReturnStatement |
    BoundExpressionStatement
    ;
