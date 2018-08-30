import { Token } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class NullExpression extends Expression {
    static CHILD_NAMES: (keyof NullExpression)[] = [
        'newlines',
        'nullKeyword',
    ];

    readonly kind = NodeKind.NullExpression;

    nullKeyword: Token;
}
