import { ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { MissingToken } from '../../Token/MissingToken';
import { TokenKind } from '../../Token/TokenKind';
import { Node } from '../Node';
import { ArrayLiteral } from './ArrayLiteral';
import { AssignmentExpression } from './AssignmentExpression';
import { BinaryExpression } from './BinaryExpression';
import { BooleanLiteral } from './BooleanLiteral';
import { FloatLiteral } from './FloatLiteral';
import { GlobalScopeExpression } from './GlobalScopeExpression';
import { GroupingExpression } from './GroupingExpression';
import { IdentifierExpression } from './IdentifierExpression';
import { IndexExpression } from './IndexExpression';
import { IntegerLiteral } from './IntegerLiteral';
import { InvokeExpression } from './InvokeExpression';
import { NewExpression } from './NewExpression';
import { NullExpression } from './NullExpression';
import { ScopeMemberAccessExpression } from './ScopeMemberAccessExpression';
import { SelfExpression } from './SelfExpression';
import { SliceExpression } from './SliceExpression';
import { StringLiteral } from './StringLiteral';
import { SuperExpression } from './SuperExpression';
import { UnaryOpExpression } from './UnaryOpExpression';

export abstract class Expression extends Node {
    newlines: ParseContextElementSequence<ParseContextKind.NewlineList> | null = null;
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
    SliceExpression |
    GroupingExpression |
    UnaryOpExpression |
    BinaryExpression |
    AssignmentExpression |
    GlobalScopeExpression
    ;

export type MissableExpression = Expressions | MissingToken<TokenKind.Expression>;
