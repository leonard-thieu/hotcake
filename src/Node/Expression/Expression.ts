import { MissingExpressionToken, NewlineToken } from '../../Token/Token';
import { TokenKind } from '../../Token/TokenKind';
import { Node } from '../Node';
import { ArrayLiteral } from './ArrayLiteral';
import { BinaryExpression } from './BinaryExpression';
import { BooleanLiteral } from './BooleanLiteral';
import { FloatLiteral } from './FloatLiteral';
import { GroupingExpression } from './GroupingExpression';
import { IdentifierExpression } from './IdentifierExpression';
import { IndexExpression } from './IndexExpression';
import { IntegerLiteral } from './IntegerLiteral';
import { InvokeExpression } from './InvokeExpression';
import { NewExpression } from './NewExpression';
import { NullExpression } from './NullExpression';
import { ScopeMemberAccessExpression } from './ScopeMemberAccessExpression';
import { SelfExpression } from './SelfExpression';
import { StringLiteral } from './StringLiteral';
import { SuperExpression } from './SuperExpression';
import { UnaryOpExpression } from './UnaryOpExpression';

export abstract class Expression extends Node {
    newlines: NewlineToken[] | null = null;
}

export type Expressions =
    NewExpression |
    NullExpression |
    BooleanLiteral |
    SelfExpression |
    SuperExpression |
    StringLiteral |
    FloatLiteral |
    IntegerLiteral |
    ArrayLiteral |
    IdentifierExpression |
    ScopeMemberAccessExpression |
    InvokeExpression |
    IndexExpression |
    GroupingExpression |
    UnaryOpExpression |
    BinaryExpression
    ;


export function isMissingToken(expression: Expressions | MissingExpressionToken): expression is MissingExpressionToken {
    return expression.kind === TokenKind.Expression;
}
