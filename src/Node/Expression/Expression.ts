import { MissingToken } from '../../Token/MissingToken';
import { TokenKind } from '../../Token/TokenKind';
import { Node } from '../Node';
import { BinaryExpression } from './BinaryExpression';
import { BooleanLiteral } from './BooleanLiteral';
import { FloatLiteral } from './FloatLiteral';
import { GroupingExpression } from './GroupingExpression';
import { IndexExpression } from './IndexExpression';
import { IntegerLiteral } from './IntegerLiteral';
import { NewExpression } from './NewExpression';
import { NullExpression } from './NullExpression';
import { ScopeMemberAccessExpression } from './ScopeMemberAccessExpression';
import { SelfExpression } from './SelfExpression';
import { StringLiteral } from './StringLiteral';
import { SuperExpression } from './SuperExpression';
import { UnaryOpExpression } from './UnaryOpExpression';
import { Variable } from './Variable';

export abstract class Expression extends Node {

}

export type Expressions =
    BooleanLiteral |
    FloatLiteral |
    IntegerLiteral |
    StringLiteral |
    Variable |
    BinaryExpression |
    GroupingExpression |
    UnaryOpExpression |
    NewExpression |
    NullExpression |
    ScopeMemberAccessExpression |
    IndexExpression |
    SelfExpression |
    SuperExpression
    ;


export function isExpressionMissingToken(expression: Expressions | MissingToken): expression is MissingToken {
    return expression.kind === TokenKind.Expression;
}
