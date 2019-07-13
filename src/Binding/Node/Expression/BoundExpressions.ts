import { BoundBinaryExpression } from './BoundBinaryExpression';
import { BoundBooleanLiteralExpression } from './BoundBooleanLiteralExpression';
import { BoundFloatLiteralExpression } from './BoundFloatLiteralExpression';
import { BoundIdentifierExpression } from './BoundIdentifierExpression';
import { BoundIntegerLiteralExpression } from './BoundIntegerLiteralExpression';
import { BoundInvokeExpression } from './BoundInvokeExpression';
import { BoundNewExpression } from './BoundNewExpression';
import { BoundNullExpression } from './BoundNullExpression';
import { BoundStringLiteralExpression } from './BoundStringLiteralExpression';
import { BoundUnaryExpression } from './BoundUnaryExpression';

export type BoundExpressions =
    BoundBinaryExpression |
    BoundBooleanLiteralExpression |
    BoundFloatLiteralExpression |
    BoundIdentifierExpression |
    BoundIntegerLiteralExpression |
    BoundInvokeExpression |
    BoundNewExpression |
    BoundNullExpression |
    BoundStringLiteralExpression |
    BoundUnaryExpression
    ;
