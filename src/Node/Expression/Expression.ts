import { MissingToken } from '../../Token/MissingToken';
import { Token } from '../../Token/Token';
import { TokenKind } from '../../Token/TokenKind';
import { Node } from '../Node';
import { ArrayLiteral } from './ArrayLiteral';
import { BinaryExpression } from './BinaryExpression';
import { BooleanLiteral } from './BooleanLiteral';
import { FloatLiteral } from './FloatLiteral';
import { GroupingExpression } from './GroupingExpression';
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
import { Variable } from './Variable';

export abstract class Expression extends Node {
    newlines: Token[] | null = null;
}

export type Expressions =
    BooleanLiteral |
    FloatLiteral |
    IntegerLiteral |
    StringLiteral |
    ArrayLiteral |
    Variable |
    BinaryExpression |
    GroupingExpression |
    UnaryOpExpression |
    NewExpression |
    NullExpression |
    ScopeMemberAccessExpression |
    InvokeExpression |
    IndexExpression |
    SelfExpression |
    SuperExpression
    ;


export function isExpressionMissingToken(expression: Expressions | MissingToken): expression is MissingToken {
    return expression.kind === TokenKind.Expression;
}
