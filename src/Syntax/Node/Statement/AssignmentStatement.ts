import { MissingToken } from '../../Token/MissingToken';
import { AmpersandEqualsSignToken, AsteriskEqualsSignToken, EqualsSignToken, HyphenMinusEqualsSignToken, ModKeywordEqualsSignToken, PlusSignEqualsSignToken, ShlKeywordEqualsSignToken, ShrKeywordEqualsSignToken, SlashEqualsSignToken, TildeEqualsSignToken, VerticalBarEqualsSignToken } from '../../Token/Tokens';
import { Expressions } from '../Expression/Expressions';
import { GlobalScopeExpression } from '../Expression/GlobalScopeExpression';
import { IdentifierExpression } from '../Expression/IdentifierExpression';
import { IndexExpression } from '../Expression/IndexExpression';
import { ScopeMemberAccessExpression } from '../Expression/ScopeMemberAccessExpression';
import { NodeKind } from '../Nodes';
import { Statement } from './Statements';

export const AssignmentStatementChildNames: ReadonlyArray<keyof AssignmentStatement> = [
    'leftOperand',
    'operator',
    'rightOperand',
    'terminator',
];

export class AssignmentStatement extends Statement {
    readonly kind = NodeKind.AssignmentStatement;

    leftOperand: AssignableExpression = undefined!;
    operator: AssignmentOperatorToken = undefined!;
    rightOperand: Expressions | MissingToken = undefined!;
}

export type AssignableExpression =
    | IdentifierExpression
    | ScopeMemberAccessExpression
    | IndexExpression
    | GlobalScopeExpression
    ;

export type AssignmentOperatorToken =
    | VerticalBarEqualsSignToken
    | TildeEqualsSignToken
    | AmpersandEqualsSignToken
    | HyphenMinusEqualsSignToken
    | PlusSignEqualsSignToken
    | ShrKeywordEqualsSignToken
    | ShlKeywordEqualsSignToken
    | ModKeywordEqualsSignToken
    | SlashEqualsSignToken
    | AsteriskEqualsSignToken
    | EqualsSignToken
    ;
