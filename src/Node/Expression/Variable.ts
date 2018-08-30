import { Token } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class Variable extends Expression {
    static CHILD_NAMES: (keyof Variable)[] = [
        'newlines',
        'name',
    ];

    readonly kind = NodeKind.Variable;

    name: Token;
}
