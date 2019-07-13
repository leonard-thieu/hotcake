import { BoundExpressionStatement } from './BoundExpressionStatement';
import { BoundReturnStatement } from './BoundReturnStatement';

export type BoundStatements =
    BoundReturnStatement |
    BoundExpressionStatement
    ;
