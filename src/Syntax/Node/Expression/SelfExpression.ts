import { SelfKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export const SelfExpressionChildNames: ReadonlyArray<keyof SelfExpression> = [
    'newlines',
    'selfKeyword',
];

export class SelfExpression extends Expression {
    readonly kind = NodeKind.SelfExpression;

    selfKeyword: SelfKeywordToken = undefined!;
}
