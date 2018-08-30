import { MissingToken } from '../../Token/MissingToken';
import { Expression } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class ExpressionStatement extends Statement {
    static CHILD_NAMES: (keyof ExpressionStatement)[] = [
        'expression',
    ];

    readonly kind = NodeKind.ExpressionStatement;

    expression: Expression | MissingToken;
}
