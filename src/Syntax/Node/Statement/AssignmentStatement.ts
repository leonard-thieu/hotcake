import { AmpersandEqualsSignToken, AsteriskEqualsSignToken, EqualsSignToken, HyphenMinusEqualsSignToken, ModKeywordEqualsSignToken, PlusSignEqualsSignToken, ShlKeywordEqualsSignToken, ShrKeywordEqualsSignToken, SlashEqualsSignToken, TildeEqualsSignToken, VerticalBarEqualsSignToken } from '../../Token/Tokens';
import { MissableExpression } from '../Expression/Expressions';
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
    rightOperand: MissableExpression = undefined!;
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
