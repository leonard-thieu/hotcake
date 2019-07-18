import { FalseKeywordToken, TrueKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

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
