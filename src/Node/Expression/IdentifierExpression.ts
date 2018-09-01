import { Token } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class IdentifierExpression extends Expression {
    static CHILD_NAMES: (keyof IdentifierExpression)[] = [
        'newlines',
        'name',
    ];

    readonly kind = NodeKind.IdentifierExpression;

    name: Token;
}
