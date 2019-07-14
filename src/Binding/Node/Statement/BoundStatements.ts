import { BoundDataDeclarationStatement } from './BoundDataDeclarationStatement';
import { BoundExpressionStatement } from './BoundExpressionStatement';
import { BoundReturnStatement } from './BoundReturnStatement';

export type BoundStatements =
    BoundDataDeclarationStatement |
    BoundReturnStatement |
    BoundExpressionStatement
    ;
