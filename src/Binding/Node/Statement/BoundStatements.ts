import { BoundClassMethodDeclaration } from '../Declaration/BoundClassMethodDeclaration';
import { BoundFunctionDeclaration } from '../Declaration/BoundFunctionDeclaration';
import { BoundExpressionStatement } from './BoundExpressionStatement';
import { BoundReturnStatement } from './BoundReturnStatement';

export type BoundStatements =
    BoundReturnStatement |
    BoundExpressionStatement
    ;

export type BoundStatementsParent =
    BoundFunctionDeclaration |
    BoundClassMethodDeclaration
    ;
