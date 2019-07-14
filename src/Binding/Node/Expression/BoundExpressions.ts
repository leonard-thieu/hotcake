import { BoundArrayLiteralExpression } from './BoundArrayLiteralExpression';
import { BoundAssignmentExpression } from './BoundAssignmentExpression';
import { BoundBinaryExpression } from './BoundBinaryExpression';
import { BoundBooleanLiteralExpression } from './BoundBooleanLiteralExpression';
import { BoundFloatLiteralExpression } from './BoundFloatLiteralExpression';
import { BoundGroupingExpression } from './BoundGroupingExpression';
import { BoundIdentifierExpression } from './BoundIdentifierExpression';
import { BoundIndexExpression } from './BoundIndexExpression';
import { BoundIntegerLiteralExpression } from './BoundIntegerLiteralExpression';
import { BoundInvokeExpression } from './BoundInvokeExpression';
import { BoundNewExpression } from './BoundNewExpression';
import { BoundNullExpression } from './BoundNullExpression';
import { BoundSelfExpression } from './BoundSelfExpression';
import { BoundSliceExpression } from './BoundSliceExpression';
import { BoundStringLiteralExpression } from './BoundStringLiteralExpression';
import { BoundSuperExpression } from './BoundSuperExpression';
import { BoundUnaryExpression } from './BoundUnaryExpression';

export type BoundExpressions =
    BoundArrayLiteralExpression |
    BoundAssignmentExpression |
    BoundBinaryExpression |
    BoundBooleanLiteralExpression |
    BoundFloatLiteralExpression |
    BoundGroupingExpression |
    BoundIdentifierExpression |
    BoundIndexExpression |
    BoundIntegerLiteralExpression |
    BoundInvokeExpression |
    BoundNewExpression |
    BoundNullExpression |
    BoundSelfExpression |
    BoundSliceExpression |
    BoundStringLiteralExpression |
    BoundSuperExpression |
    BoundUnaryExpression
    ;
