import { Node } from '../Node';
import { BinaryExpression } from './BinaryExpression';
import { BooleanLiteral } from './BooleanLiteral';
import { FloatLiteral } from './FloatLiteral';
import { GroupingExpression } from './GroupingExpression';
import { IndexExpression } from './IndexExpression';
import { IntegerLiteral } from './IntegerLiteral';
import { NewExpression } from './NewExpression';
import { NullExpression } from './NullExpression';
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
    IndexExpression |
    SelfExpression |
    SuperExpression
    ;
