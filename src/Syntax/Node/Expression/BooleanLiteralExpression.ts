import { FalseKeywordToken, TrueKeywordToken } from '../../Token/Tokens';
import { NodeKind } from '../Nodes';
import { Expression } from './Expressions';

export const BooleanLiteralExpressionChildNames: ReadonlyArray<keyof BooleanLiteralExpression> = [
    'newlines',
    'value',
];

export class BooleanLiteralExpression extends Expression {
    readonly kind = NodeKind.BooleanLiteralExpression;

    value: BooleanLiteralExpressionValueToken = undefined!;
}

export type BooleanLiteralExpressionValueToken =
    | TrueKeywordToken
    | FalseKeywordToken
    ;
