import { MissingToken } from '../../Token/MissingToken';
import { NewlineToken } from '../../Token/Tokens';
import { Node } from '../Nodes';
import { ArrayLiteralExpression } from './ArrayLiteralExpression';
import { BinaryExpression } from './BinaryExpression';
import { BooleanLiteralExpression } from './BooleanLiteralExpression';
import { FloatLiteralExpression } from './FloatLiteralExpression';
import { GlobalScopeExpression } from './GlobalScopeExpression';
import { GroupingExpression } from './GroupingExpression';
import { IdentifierExpression } from './IdentifierExpression';
import { IndexExpression } from './IndexExpression';
import { IntegerLiteralExpression } from './IntegerLiteralExpression';
import { InvokeExpression } from './InvokeExpression';
import { NewExpression } from './NewExpression';
import { NullExpression } from './NullExpression';
import { ScopeMemberAccessExpression } from './ScopeMemberAccessExpression';
import { SelfExpression } from './SelfExpression';
import { SliceExpression } from './SliceExpression';
import { StringLiteralExpression } from './StringLiteralExpression';
import { SuperExpression } from './SuperExpression';
import { UnaryExpression } from './UnaryExpression';

export abstract class Expression extends Node {
    newlines?: NewlineToken[] = undefined;
}

export type Expressions =
    | BinaryExpression
    | UnaryExpression
    | PrimaryExpression
    ;

export type MissableExpression =
    | Expressions
    | MissingToken
    ;

export type PrimaryExpression =
    | NewExpression
    | NullExpression
    | BooleanLiteralExpression
    | SelfExpression
    | SuperExpression
    | IntegerLiteralExpression
    | FloatLiteralExpression
    | StringLiteralExpression
    | ArrayLiteralExpression
    | IdentifierExpression
    | ScopeMemberAccessExpression
    | InvokeExpression
    | IndexExpression
    | SliceExpression
    | GlobalScopeExpression
    | GroupingExpression
    ;
