import { Token } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class SuperExpression extends Expression {
    static CHILD_NAMES: (keyof SuperExpression)[] = [
        'superKeyword',
    ];

    readonly kind = NodeKind.SuperExpression;

    superKeyword: Token;
}
