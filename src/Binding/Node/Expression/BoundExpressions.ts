import { BoundArrayLiteralExpression } from './BoundArrayLiteralExpression';
import { BoundBinaryExpression } from './BoundBinaryExpression';
import { BoundBooleanLiteralExpression } from './BoundBooleanLiteralExpression';
import { BoundFloatLiteralExpression } from './BoundFloatLiteralExpression';
import { BoundIdentifierExpression } from './BoundIdentifierExpression';
import { BoundIndexExpression } from './BoundIndexExpression';
import { BoundIntegerLiteralExpression } from './BoundIntegerLiteralExpression';
import { BoundInvokeExpression } from './BoundInvokeExpression';
import { BoundNewExpression } from './BoundNewExpression';
import { BoundNullExpression } from './BoundNullExpression';
import { BoundSelfExpression } from './BoundSelfExpression';
import { BoundStringLiteralExpression } from './BoundStringLiteralExpression';
import { BoundSuperExpression } from './BoundSuperExpression';
import { BoundUnaryExpression } from './BoundUnaryExpression';

export type BoundExpressions =
    BoundArrayLiteralExpression |
    BoundBinaryExpression |
    BoundBooleanLiteralExpression |
    BoundFloatLiteralExpression |
    BoundIdentifierExpression |
    BoundIndexExpression |
    BoundIntegerLiteralExpression |
    BoundInvokeExpression |
    BoundNewExpression |
    BoundNullExpression |
    BoundSelfExpression |
    BoundStringLiteralExpression |
    BoundSuperExpression |
    BoundUnaryExpression
    ;
