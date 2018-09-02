import { MissingToken } from '../../Token/MissingToken';
import { ThrowKeywordToken } from '../../Token/Token';
import { Expression } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class ThrowStatement extends Statement {
    static CHILD_NAMES: (keyof ThrowStatement)[] = [
        'throwKeyword',
        'expression',
        'terminator',
    ];

    readonly kind = NodeKind.ThrowStatement;

    throwKeyword: ThrowKeywordToken;
    expression: Expression | MissingToken;
}
