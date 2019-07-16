import { BoundArrayLiteralExpression } from './BoundArrayLiteralExpression';
import { BoundAssignmentExpression } from './BoundAssignmentExpression';
import { BoundBinaryExpression } from './BoundBinaryExpression';
import { BoundBooleanLiteralExpression } from './BoundBooleanLiteralExpression';
import { BoundFloatLiteralExpression } from './BoundFloatLiteralExpression';
import { BoundGlobalScopeExpression } from './BoundGlobalScopeExpression';
import { BoundGroupingExpression } from './BoundGroupingExpression';
import { BoundIdentifierExpression } from './BoundIdentifierExpression';
import { BoundIndexExpression } from './BoundIndexExpression';
import { BoundIntegerLiteralExpression } from './BoundIntegerLiteralExpression';
import { BoundInvokeExpression } from './BoundInvokeExpression';
import { BoundNewExpression } from './BoundNewExpression';
import { BoundNullExpression } from './BoundNullExpression';
import { BoundScopeMemberAccessExpression } from './BoundScopeMemberAccessExpression';
import { BoundSelfExpression } from './BoundSelfExpression';
import { BoundSliceExpression } from './BoundSliceExpression';
import { BoundStringLiteralExpression } from './BoundStringLiteralExpression';
import { BoundSuperExpression } from './BoundSuperExpression';
import { BoundUnaryExpression } from './BoundUnaryExpression';

export type BoundExpressions =
    BoundAssignmentExpression |
    BoundBinaryExpression |
    BoundUnaryExpression |
    BoundNewExpression |
    BoundNullExpression |
    BoundBooleanLiteralExpression |
    BoundSelfExpression |
    BoundSuperExpression |
    BoundStringLiteralExpression |
    BoundFloatLiteralExpression |
    BoundIntegerLiteralExpression |
    BoundArrayLiteralExpression |
    BoundGlobalScopeExpression |
    BoundIdentifierExpression |
    BoundGroupingExpression |
    BoundScopeMemberAccessExpression |
    BoundIndexExpression |
    BoundSliceExpression |
    BoundInvokeExpression
    ;
