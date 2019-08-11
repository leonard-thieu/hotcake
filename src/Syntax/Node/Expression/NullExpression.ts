import { NullKeywordToken } from '../../Token/Tokens';
import { NodeKind } from '../Nodes';
import { Expression } from './Expressions';

export const NullExpressionChildNames: ReadonlyArray<keyof NullExpression> = [
    'newlines',
    'nullKeyword',
];

export class NullExpression extends Expression {
    readonly kind = NodeKind.NullExpression;

    nullKeyword: NullKeywordToken = undefined!;
}
