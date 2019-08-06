import { SuperKeywordToken } from '../../Token/Tokens';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export const SuperExpressionChildNames: ReadonlyArray<keyof SuperExpression> = [
    'newlines',
    'superKeyword',
];

export class SuperExpression extends Expression {
    readonly kind = NodeKind.SuperExpression;

    superKeyword: SuperKeywordToken = undefined!;
}
