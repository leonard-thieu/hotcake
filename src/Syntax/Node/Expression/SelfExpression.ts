import { SelfKeywordToken } from '../../Token/Tokens';
import { NodeKind } from '../Nodes';
import { Expression } from './Expressions';

export const SelfExpressionChildNames: ReadonlyArray<keyof SelfExpression> = [
    'newlines',
    'selfKeyword',
];

export class SelfExpression extends Expression {
    readonly kind = NodeKind.SelfExpression;

    selfKeyword: SelfKeywordToken = undefined!;
}
